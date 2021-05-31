/* eslint-disable global-require */
import { getConfig } from '@edx/frontend-platform';
import * as analytics from '@edx/frontend-platform/analytics';
import { AppContext } from '@edx/frontend-platform/react';
import { configure as configureI18n, IntlProvider } from '@edx/frontend-platform/i18n';
import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import messages from '../i18n';
import ProfilePage from './ProfilePage';

const mockStore = configureMockStore([thunk]);
const storeMocks = {
  loadingApp: require('./__mocks__/loadingApp.mockStore.js'),
  viewOwnProfile: require('./__mocks__/viewOwnProfile.mockStore.js'),
  viewOtherProfile: require('./__mocks__/viewOtherProfile.mockStore.js'),
  savingEditedBio: require('./__mocks__/savingEditedBio.mockStore.js'),
};
const requiredProfilePageProps = {
  fetchUserAccount: () => {},
  fetchProfile: () => {},
  saveProfile: () => {},
  saveProfilePhoto: () => {},
  deleteProfilePhoto: () => {},
  openField: () => {},
  closeField: () => {},
  match: { params: { username: 'staff' } },
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

describe('<ProfilePage />', () => {
  describe('Renders correctly in various states', () => {
    it('app loading', () => {
      const component = (
        <AppContext.Provider
          value={{
            authenticatedUser: { userId: null, username: null, administrator: false },
            config: getConfig(),
          }}
        >
          <IntlProvider locale="en">
            <Provider store={mockStore(storeMocks.loadingApp)}>
              <ProfilePage {...requiredProfilePageProps} />
            </Provider>
          </IntlProvider>
        </AppContext.Provider>
      );
      const tree = renderer.create(component).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('viewing own profile', () => {
      const component = (
        <AppContext.Provider
          value={{
            authenticatedUser: { userId: 123, username: 'staff', administrator: true },
            config: getConfig(),
          }}
        >
          <IntlProvider locale="en">
            <Provider store={mockStore(storeMocks.viewOwnProfile)}>
              <ProfilePage {...requiredProfilePageProps} />
            </Provider>
          </IntlProvider>
        </AppContext.Provider>
      );
      const tree = renderer.create(component).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('viewing other profile', () => {
      const component = (
        <AppContext.Provider
          value={{
            authenticatedUser: { userId: 123, username: 'staff', administrator: true },
            config: getConfig(),
          }}
        >
          <IntlProvider locale="en">
            <Provider store={mockStore(storeMocks.viewOtherProfile)}>
              <ProfilePage
                {...requiredProfilePageProps}
                match={{ params: { username: 'verified' } }} // Override default match
              />
            </Provider>
          </IntlProvider>
        </AppContext.Provider>
      );
      const tree = renderer.create(component).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('while saving an edited bio', () => {
      const component = (
        <AppContext.Provider
          value={{
            authenticatedUser: { userId: 123, username: 'staff', administrator: true },
            config: getConfig(),
          }}
        >
          <IntlProvider locale="en">
            <Provider store={mockStore(storeMocks.savingEditedBio)}>
              <ProfilePage {...requiredProfilePageProps} />
            </Provider>
          </IntlProvider>
        </AppContext.Provider>
      );
      const tree = renderer.create(component).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('without credentials service', () => {
      const config = getConfig();
      config.CREDENTIALS_BASE_URL = '';

      const component = (
        <AppContext.Provider
          value={{
            authenticatedUser: { userId: 123, username: 'staff', administrator: true },
            config,
          }}
        >
          <IntlProvider locale="en">
            <Provider store={mockStore(storeMocks.viewOwnProfile)}>
              <ProfilePage {...requiredProfilePageProps} />
            </Provider>
          </IntlProvider>
        </AppContext.Provider>
      );
      const tree = renderer.create(component).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('handles analytics', () => {
    it('calls sendTrackingLogEvent when mounting', () => {
      const component = (
        <AppContext.Provider
          value={{
            authenticatedUser: { userId: 123, username: 'staff', administrator: true },
            config: getConfig(),
          }}
        >
          <IntlProvider locale="en">
            <Provider store={mockStore(storeMocks.loadingApp)}>
              <ProfilePage
                {...requiredProfilePageProps}
                match={{ params: { username: 'test-username' } }}
              />
            </Provider>
          </IntlProvider>
        </AppContext.Provider>
      );
      const wrapper = mount(component);
      wrapper.update();

      expect(analytics.sendTrackingLogEvent.mock.calls.length).toBe(1);
      expect(analytics.sendTrackingLogEvent.mock.calls[0][0]).toEqual('edx.profile.viewed');
      expect(analytics.sendTrackingLogEvent.mock.calls[0][1]).toEqual({
        username: 'test-username',
      });
    });
  });
});
