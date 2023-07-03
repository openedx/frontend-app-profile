import React from 'react';
import { AppContext } from '@edx/frontend-platform/react';
import { getConfig } from '@edx/frontend-platform';
import { Router } from 'react-router';
import { render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { getLoginRedirectUrl } from '@edx/frontend-platform/auth';
import AppRoutes from './AppRoutes';

jest.mock('@edx/frontend-platform/analytics');

jest.mock('@edx/frontend-platform/auth', () => ({
  getLoginRedirectUrl: jest.fn(),
}));

jest.mock('../profile', () => ({
  ProfilePage: () => (<div>Profile page</div>),
  NotFoundPage: () => (<div>Not found page</div>),
}));

const RoutesWithProvider = (context, history) => (
  <AppContext.Provider value={context}>
    <Router history={history}>
      <AppRoutes />
    </Router>
  </AppContext.Provider>
);

const unauthenticatedUser = {
  authenticatedUser: null,
  config: getConfig(),
};

describe('routes', () => {
  let history;

  beforeEach(() => {
    history = createMemoryHistory();
  });

  test('Profile page should redirect for unauthenticated users', () => {
    history.push('/u/edx');
    render(
      RoutesWithProvider(unauthenticatedUser, history),
    );
    expect(getLoginRedirectUrl).toHaveBeenCalled();
  });

  test('Profile page should be accessible for authenticated users', () => {
    history.push('/u/edx');
    render(
      RoutesWithProvider(
        {
          authenticatedUser: {
            username: 'edx',
            email: 'edx@example.com',
          },
          config: getConfig(),
        },
        history,
      ),
    );
    expect(screen.getByText('Profile page')).toBeTruthy();
  });

  test('should show NotFound page for a bad route', () => {
    history.push('/nonMatchingRoute');
    render(
      RoutesWithProvider(unauthenticatedUser, history),
    );
    expect(screen.getByText('Not found page')).toBeTruthy();
  });
});
