import { ReactElement, ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { CurrentAppProvider, IntlProvider } from '@openedx/frontend-base';

import { appId } from '@src/constants';

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

interface WrapperOptions {
  queryClient?: QueryClient;
  route?: string;
  path?: string;
}

/**
 * The providers the app expects: react-query, i18n, the app config `useAppConfig` reads, and a
 * memory router with `children` mounted at `path`, so `useParams` resolves. The same set `Main`
 * puts around the pages at runtime.
 */
export const createWrapper = ({
  queryClient = createTestQueryClient(),
  route = '/',
  path = '*',
}: WrapperOptions = {}) => {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <CurrentAppProvider appId={appId}>
        <IntlProvider locale="en">
          <MemoryRouter initialEntries={[route]}>
            <Routes>
              <Route path={path} element={children} />
            </Routes>
          </MemoryRouter>
        </IntlProvider>
      </CurrentAppProvider>
    </QueryClientProvider>
  );

  return Wrapper;
};

type RenderWithProvidersOptions = WrapperOptions & Omit<RenderOptions, 'wrapper'>;

export const renderWithProviders = (ui: ReactElement, {
  queryClient = createTestQueryClient(),
  route = '/',
  path = '*',
  ...renderOptions
}: RenderWithProvidersOptions = {}) => ({
  queryClient,
  ...render(ui, {
    wrapper: createWrapper({ queryClient, route, path }),
    ...renderOptions,
  }),
});

export default renderWithProviders;
