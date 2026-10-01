import PropTypes from 'prop-types';
// This module is only ever imported by tests.
// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from '@testing-library/react';

import { createTestQueryClient, createWrapper } from '@src/tests/renderWithProviders';
import { ProfileFormContext } from '@src/profile/data/FormContext';
import { initialFormState } from '@src/profile/data/formReducer';

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
  route = '/',
  path = '*',
  ...renderOptions
} = {}) => {
  const formValue = createFormContextValue(form);
  const Providers = createWrapper({ queryClient, route, path });

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
