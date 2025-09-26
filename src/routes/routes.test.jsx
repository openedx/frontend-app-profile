import React from 'react';
import { getConfig, AppContext, getLoginRedirectUrl } from '@openedx/frontend-base';
import { MemoryRouter as Router } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import AppRoutes from './AppRoutes';

// jest.mock('@openedx/frontend-base/analytics');

jest.mock('@openedx/frontend-base', () => ({
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
