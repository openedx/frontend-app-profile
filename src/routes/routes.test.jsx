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

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(() => ({
    ENABLE_SKILLS_BUILDER: true,
  })),
}));

jest.mock('../profile', () => ({
  ProfilePage: () => (<div>Profile page</div>),
  NotFoundPage: () => (<div>Not found page</div>),
}));

jest.mock('../skills-builder', () => ({
  SkillsBuilder: () => (<div>Skills Builder</div>),
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

  test('Skills Builder page should be accessible to unauthenticated users', () => {
    history.push('/skills');
    render(
      RoutesWithProvider(unauthenticatedUser, history),
    );
    expect(screen.getByText('Skills Builder')).toBeTruthy();
  });

  test('should show NotFound page for a bad route', () => {
    history.push('/nonMatchingRoute');
    render(
      RoutesWithProvider(unauthenticatedUser, history),
    );
    expect(screen.getByText('Not found page')).toBeTruthy();
  });
});
