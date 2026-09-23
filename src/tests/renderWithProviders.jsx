import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
// This module is only ever imported by tests.
// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { getConfig } from '@edx/frontend-platform';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { AppContext } from '@edx/frontend-platform/react';

import { ProfileFormContext } from '../profile/data/FormContext';
import { initialFormState } from '../profile/data/formReducer';

/**
 * A QueryClient for tests: no retries (and no delay between the retries a query insists on), so
 * failures surface immediately, and no cache retention between tests. Pass `gcTime: Infinity`
 * when a test seeds the cache without anything observing it.
 */
export const createTestQueryClient = (queryOptions = {}) => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      retryDelay: 0,
      gcTime: 0,
      ...queryOptions,
    },
    mutations: {
      retry: false,
    },
  },
});

/**
 * The providers the app expects: react-query, i18n, a memory router (with `children` mounted at
 * `path`, so `useParams` resolves) and, when `appContext` is given, frontend-platform's AppContext.
 */
export const createWrapper = ({
  queryClient = createTestQueryClient(),
  appContext = null,
  route = '/',
  path = '*',
} = {}) => {
  const Wrapper = ({ children }) => {
    const tree = (
      <QueryClientProvider client={queryClient}>
        <IntlProvider locale="en">
          <MemoryRouter initialEntries={[route]}>
            <Routes>
              <Route path={path} element={children} />
            </Routes>
          </MemoryRouter>
        </IntlProvider>
      </QueryClientProvider>
    );

    const value = useMemo(() => ({
      authenticatedUser: null,
      config: getConfig(),
      ...appContext,
    }), []);

    if (!appContext) {
      return tree;
    }

    return <AppContext.Provider value={value}>{tree}</AppContext.Provider>;
  };

  Wrapper.propTypes = {
    children: PropTypes.node.isRequired,
  };

  return Wrapper;
};

export const renderWithProviders = (ui, {
  queryClient = createTestQueryClient(),
  appContext = null,
  route = '/',
  path = '*',
  ...renderOptions
} = {}) => ({
  queryClient,
  ...render(ui, {
    wrapper: createWrapper({
      queryClient, appContext, route, path,
    }),
    ...renderOptions,
  }),
});

const noop = () => {};

/**
 * A stand-in for the form context, for leaf components that read from it. Every action is a
 * no-op unless the test supplies its own (usually a `jest.fn()`).
 */
export const createFormContextValue = (overrides = {}) => ({
  ...initialFormState,
  username: 'staff',
  isOwnProfile: true,
  openForm: noop,
  closeForm: noop,
  updateDraft: noop,
  saveProfile: noop,
  ...overrides,
});

/**
 * Renders `ui` inside the usual providers plus a stubbed form context built from `form`.
 */
export const renderWithForm = (ui, {
  form = {},
  queryClient = createTestQueryClient(),
  appContext = null,
  route = '/',
  path = '*',
  ...renderOptions
} = {}) => {
  const formValue = createFormContextValue(form);
  const Providers = createWrapper({
    queryClient, appContext, route, path,
  });

  const Wrapper = ({ children }) => (
    <Providers>
      <ProfileFormContext.Provider value={formValue}>
        {children}
      </ProfileFormContext.Provider>
    </Providers>
  );

  Wrapper.propTypes = {
    children: PropTypes.node.isRequired,
  };

  return {
    form: formValue,
    queryClient,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
};
