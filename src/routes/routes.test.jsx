import React from 'react';
import { AppContext } from '@edx/frontend-platform/react';
import { getConfig } from '@edx/frontend-platform';
import { MemoryRouter as Router } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
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

const RoutesWithProvider = (context, path) => (
  <AppContext.Provider value={context}>
    <Router initialEntries={[`${path}`]}>
      <AppRoutes />
    </Router>
  </AppContext.Provider>
);

const unauthenticatedUser = {
  authenticatedUser: null,
  config: getConfig(),
};

describe('routes', () => {
  test('Profile page should redirect for unauthenticated users', () => {
    render(
      RoutesWithProvider(unauthenticatedUser, '/u/edx'),
    );
    expect(getLoginRedirectUrl).toHaveBeenCalled();
  });

  test('Profile page should be accessible for authenticated users', () => {
    render(
      RoutesWithProvider(
        {
          authenticatedUser: {
            username: 'edx',
            email: 'edx@example.com',
          },
          config: getConfig(),
        },
        '/u/edx',
      ),
    );
    expect(screen.getByText('Profile page')).toBeTruthy();
  });

  test('should show NotFound page for a bad route', () => {
    render(
      RoutesWithProvider(unauthenticatedUser, '/nonMatchingRoute'),
    );
    expect(screen.getByText('Not found page')).toBeTruthy();
  });
});
