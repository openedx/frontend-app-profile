import { getConfig } from '@edx/frontend-platform';
import * as analytics from '@edx/frontend-platform/analytics';
import { AppContext } from '@edx/frontend-platform/react';
import { configure as configureI18n, IntlProvider } from '@edx/frontend-platform/i18n';
import { render } from '@testing-library/react';
import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {
  MemoryRouter,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';

import messages from '../i18n';
import ProfilePage from './ProfilePage';
import loadingApp from './__mocks__/loadingApp.mockStore';
import viewOwnProfile from './__mocks__/viewOwnProfile.mockStore';
import viewOtherProfile from './__mocks__/viewOtherProfile.mockStore';
import invalidUser from './__mocks__/invalidUser.mockStore';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

const mockStore = configureMockStore([thunk]);

const storeMocks = {
  loadingApp,
  viewOwnProfile,
  viewOtherProfile,
  invalidUser,
};

const requiredProfilePageProps = {
  params: { username: 'staff' },
};

Object.defineProperty(global.document, 'cookie', {
  writable: true,
  value: `${getConfig().LANGUAGE_PREFERENCE_COOKIE_NAME}=en`,
});

jest.mock('@edx/frontend-platform/auth', () => ({
  configure: () => {},
  getAuthenticatedUser: () => null,
  fetchAuthenticatedUser: () => null,
  getAuthenticatedHttpClient: jest.fn(),
  AUTHENTICATED_USER_CHANGED: 'user_changed',
}));

jest.mock('@edx/frontend-platform/analytics', () => ({
  configure: () => {},
  identifyAnonymousUser: jest.fn(),
  identifyAuthenticatedUser: jest.fn(),
  sendTrackingLogEvent: jest.fn(),
}));

configureI18n({
  loggingService: { logError: jest.fn() },
  config: {
    ENVIRONMENT: 'production',
    LANGUAGE_PREFERENCE_COOKIE_NAME: 'yum',
  },
  messages,
});

beforeEach(() => {
  analytics.sendTrackingLogEvent.mockReset();
  useNavigate.mockReset();
});

const ProfilePageWrapper = ({
  contextValue, store, params,
}) => (
  <AppContext.Provider value={contextValue}>
    <IntlProvider locale="en">
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/profile/${params.username}`]}>
          <Routes>
            <Route
              path="/profile/:username"
              element={<ProfilePage {...requiredProfilePageProps} params={params} />}
            />
          </Routes>
        </MemoryRouter>
      </Provider>
    </IntlProvider>
  </AppContext.Provider>
);

ProfilePageWrapper.defaultProps = {
  // eslint-disable-next-line react/default-props-match-prop-types
  params: { username: 'staff' },
};

ProfilePageWrapper.propTypes = {
  contextValue: PropTypes.shape({}).isRequired,
  store: PropTypes.shape({}).isRequired,
  params: PropTypes.shape({
    username: PropTypes.string.isRequired,
  }).isRequired,
};

describe('<ProfilePage />', () => {
  describe('Renders correctly in various states', () => {
    it('app loading', () => {
      const contextValue = {
        authenticatedUser: { userId: null, username: null, administrator: false },
        config: getConfig(),
      };
      const component = (
        <ProfilePageWrapper
          contextValue={contextValue}
          store={mockStore(storeMocks.loadingApp)}
        />
      );
      const { container: tree } = render(component);
      expect(tree).toMatchSnapshot();
    });

    it('viewing own profile', () => {
      const contextValue = {
        authenticatedUser: { userId: 123, username: 'staff', administrator: true },
        config: getConfig(),
      };
      const component = (
        <ProfilePageWrapper
          contextValue={contextValue}
          store={mockStore(storeMocks.viewOwnProfile)}
        />
      );
      const { container: tree } = render(component);
      expect(tree).toMatchSnapshot();
    });

    it('viewing other profile with all fields', () => {
      const contextValue = {
        authenticatedUser: { userId: 123, username: 'staff', administrator: true },
        config: getConfig(),
      };
      const component = (
        <ProfilePageWrapper
          contextValue={contextValue}
          store={mockStore({
            ...storeMocks.viewOtherProfile,
            profilePage: {
              ...storeMocks.viewOtherProfile.profilePage,
              account: {
                ...storeMocks.viewOtherProfile.profilePage.account,
                name: 'Verified User',
                country: 'US',
                bio: 'About me',
                courseCertificates: [{ title: 'Course 1' }],
                levelOfEducation: 'bachelors',
                languageProficiencies: [{ code: 'en' }],
                socialLinks: [{ platform: 'twitter', socialLink: 'https://twitter.com/user' }],
              },
              preferences: {
                ...storeMocks.viewOtherProfile.profilePage.preferences,
                visibilityName: 'all_users',
                visibilityCountry: 'all_users',
                visibilityLevelOfEducation: 'all_users',
                visibilityLanguageProficiencies: 'all_users',
                visibilitySocialLinks: 'all_users',
                visibilityBio: 'all_users',
              },
            },
          })}
          params={{ username: 'verified' }}
        />
      );
      const { container: tree } = render(component);
      expect(tree).toMatchSnapshot();
    });

    it('without credentials service', () => {
      const config = getConfig();
      config.CREDENTIALS_BASE_URL = '';

      const contextValue = {
        authenticatedUser: { userId: 123, username: 'staff', administrator: true },
        config: getConfig(),
      };
      const component = (
        <ProfilePageWrapper
          contextValue={contextValue}
          store={mockStore(storeMocks.viewOwnProfile)}
        />
      );
      const { container: tree } = render(component);
      expect(tree).toMatchSnapshot();
    });

    it('successfully redirected to not found page', () => {
      const contextValue = {
        authenticatedUser: { userId: 123, username: 'staff', administrator: true },
        config: getConfig(),
      };
      const navigate = jest.fn();
      useNavigate.mockReturnValue(navigate);
      const component = (
        <ProfilePageWrapper
          contextValue={contextValue}
          store={mockStore(storeMocks.invalidUser)}
          params={{ username: 'staffTest' }}
        />
      );
      const { container: tree } = render(component);
      expect(tree).toMatchSnapshot();
      expect(navigate).toHaveBeenCalledWith('/notfound');
    });
  });

  describe('handles analytics', () => {
    it('calls sendTrackingLogEvent when mounting', () => {
      const contextValue = {
        authenticatedUser: { userId: 123, username: 'staff', administrator: true },
        config: getConfig(),
      };
      render(
        <ProfilePageWrapper
          contextValue={contextValue}
          store={mockStore(storeMocks.loadingApp)}
          params={{ username: 'test-username' }}
        />,
      );

      expect(analytics.sendTrackingLogEvent).toHaveBeenCalledTimes(1);
      expect(analytics.sendTrackingLogEvent).toHaveBeenCalledWith('edx.profile.viewed', {
        username: 'test-username',
      });
    });
  });

  describe('handles navigation', () => {
    it('navigates to notfound on save error with no username', () => {
      const contextValue = {
        authenticatedUser: { userId: 123, username: 'staff', administrator: true },
        config: getConfig(),
      };
      const navigate = jest.fn();
      useNavigate.mockReturnValue(navigate);
      render(
        <ProfilePageWrapper
          contextValue={contextValue}
          store={mockStore(storeMocks.invalidUser)}
          params={{ username: 'staffTest' }}
        />,
      );

      expect(navigate).toHaveBeenCalledWith('/notfound');
    });
  });
});
