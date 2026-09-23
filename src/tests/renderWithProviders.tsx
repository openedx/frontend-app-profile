import { ContextType, ReactElement, ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { getSiteConfig, IntlProvider, SiteContext } from '@openedx/frontend-base';

type SiteContextValue = ContextType<typeof SiteContext>;

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
  siteContext?: Partial<SiteContextValue> | null;
  route?: string;
  path?: string;
}

/**
 * The providers the app expects: react-query, i18n, a memory router (with `children` mounted at
 * `path`, so `useParams` resolves) and, when `siteContext` is given, frontend-base's SiteContext.
 */
export const createWrapper = ({
  queryClient = createTestQueryClient(),
  siteContext = null,
  route = '/',
  path = '*',
}: WrapperOptions = {}) => {
  const Wrapper = ({ children }: { children: ReactNode }) => {
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

    if (!siteContext) {
      return tree;
    }

    const value: SiteContextValue = {
      authenticatedUser: null,
      siteConfig: getSiteConfig(),
      locale: 'en',
      ...siteContext,
    };

    return <SiteContext.Provider value={value}>{tree}</SiteContext.Provider>;
  };

  return Wrapper;
};

type RenderWithProvidersOptions = WrapperOptions & Omit<RenderOptions, 'wrapper'>;

export const renderWithProviders = (ui: ReactElement, {
  queryClient = createTestQueryClient(),
  siteContext = null,
  route = '/',
  path = '*',
  ...renderOptions
}: RenderWithProvidersOptions = {}) => ({
  queryClient,
  ...render(ui, {
    wrapper: createWrapper({
      queryClient, siteContext, route, path,
    }),
    ...renderOptions,
  }),
});

export default renderWithProviders;
