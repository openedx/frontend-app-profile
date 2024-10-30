/* eslint-disable global-require */
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

import messages from '../i18n';
import ProfilePage from './ProfilePage';

const mockStore = configureMockStore([thunk]);
const storeMocks = {
  loadingApp: require('./__mocks__/loadingApp.mockStore'),
  viewOwnProfile: require('./__mocks__/viewOwnProfile.mockStore'),
  viewOtherProfile: require('./__mocks__/viewOtherProfile.mockStore'),
};
const requiredProfilePageProps = {
  fetchUserAccount: () => {},
  fetchProfile: () => {},
  params: { username: 'staff' },
};

// Mock language cookie
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
});

const ProfilePageWrapper = ({
  contextValue, store, params,
}) => (
  <AppContext.Provider
    value={contextValue}
  >
    <IntlProvider locale="en">
      <Provider store={store}>
        <ProfilePage {...requiredProfilePageProps} params={params} />
      </Provider>
    </IntlProvider>
  </AppContext.Provider>
);

ProfilePageWrapper.defaultProps = {
  params: { username: 'staff' },
};

ProfilePageWrapper.propTypes = {
  contextValue: PropTypes.shape({}).isRequired,
  store: PropTypes.shape({}).isRequired,
  params: PropTypes.shape({}),
};

describe('<ProfilePage />', () => {
  describe('Renders correctly in various states', () => {
    it('app loading', () => {
      const contextValue = {
        authenticatedUser: { userId: null, username: null, administrator: false },
        config: getConfig(),
      };
      const component = <ProfilePageWrapper contextValue={contextValue} store={mockStore(storeMocks.loadingApp)} />;
      const { container: tree } = render(component);
      expect(tree).toMatchSnapshot();
    });

    it('viewing own profile', () => {
      const contextValue = {
        authenticatedUser: { userId: 123, username: 'staff', administrator: true },
        config: getConfig(),
      };
      const component = <ProfilePageWrapper contextValue={contextValue} store={mockStore(storeMocks.viewOwnProfile)} />;
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
                name: 'user',
                country: 'EN',
                bio: 'bio',
                courseCertificates: ['course certificates'],
                levelOfEducation: 'some level',
                languageProficiencies: ['some lang'],
                socialLinks: ['twitter'],
                timeZone: 'time zone',
                accountPrivacy: 'all_users',
              },
            },
          })}
          match={{ params: { username: 'verified' } }} // Override default match
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

      expect(analytics.sendTrackingLogEvent.mock.calls.length).toBe(1);
      expect(analytics.sendTrackingLogEvent.mock.calls[0][0]).toEqual('edx.profile.viewed');
      expect(analytics.sendTrackingLogEvent.mock.calls[0][1]).toEqual({
        username: 'test-username',
      });
    });
  });
});
