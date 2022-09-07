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
  loadingApp: require('./__mocks__/loadingApp.mockStore'),
  viewOwnProfile: require('./__mocks__/viewOwnProfile.mockStore'),
  viewOtherProfile: require('./__mocks__/viewOtherProfile.mockStore'),
  savingEditedBio: require('./__mocks__/savingEditedBio.mockStore'),
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

    it('while saving an edited bio with error', () => {
      const storeData = JSON.parse(JSON.stringify(storeMocks.savingEditedBio));
      storeData.profilePage.errors.bio = { userMessage: 'bio error' };
      const component = (
        <AppContext.Provider
          value={{
            authenticatedUser: { userId: 123, username: 'staff', administrator: true },
            config: getConfig(),
          }}
        >
          <IntlProvider locale="en">
            <Provider store={mockStore(storeData)}>
              <ProfilePage {...requiredProfilePageProps} />
            </Provider>
          </IntlProvider>
        </AppContext.Provider>
      );
      const tree = renderer.create(component).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('test country edit with error', () => {
      const storeData = JSON.parse(JSON.stringify(storeMocks.savingEditedBio));
      storeData.profilePage.errors.country = { userMessage: 'country error' };
      storeData.profilePage.currentlyEditingField = 'country';
      const component = (
        <AppContext.Provider
          value={{
            authenticatedUser: { userId: 123, username: 'staff', administrator: true },
            config: getConfig(),
          }}
        >
          <IntlProvider locale="en">
            <Provider store={mockStore(storeData)}>
              <ProfilePage {...requiredProfilePageProps} />
            </Provider>
          </IntlProvider>
        </AppContext.Provider>
      );
      const tree = renderer.create(component).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('test education edit with error', () => {
      const storeData = JSON.parse(JSON.stringify(storeMocks.savingEditedBio));
      storeData.profilePage.errors.levelOfEducation = { userMessage: 'education error' };
      storeData.profilePage.currentlyEditingField = 'levelOfEducation';
      const component = (
        <AppContext.Provider
          value={{
            authenticatedUser: { userId: 123, username: 'staff', administrator: true },
            config: getConfig(),
          }}
        >
          <IntlProvider locale="en">
            <Provider store={mockStore(storeData)}>
              <ProfilePage {...requiredProfilePageProps} />
            </Provider>
          </IntlProvider>
        </AppContext.Provider>
      );
      const tree = renderer.create(component).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('test preferreded language edit with error', () => {
      const storeData = JSON.parse(JSON.stringify(storeMocks.savingEditedBio));
      storeData.profilePage.errors.languageProficiencies = { userMessage: 'preferred language error' };
      storeData.profilePage.currentlyEditingField = 'languageProficiencies';
      const component = (
        <AppContext.Provider
          value={{
            authenticatedUser: { userId: 123, username: 'staff', administrator: true },
            config: getConfig(),
          }}
        >
          <IntlProvider locale="en">
            <Provider store={mockStore(storeData)}>
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
    it('test age message alert', () => {
      const storeData = JSON.parse(JSON.stringify(storeMocks.viewOwnProfile));
      storeData.userAccount.requiresParentalConsent = true;
      storeData.profilePage.account.requiresParentalConsent = true;
      const component = (
        <AppContext.Provider
          value={{
            authenticatedUser: { userId: 123, username: 'staff', administrator: true },
            config: { ...getConfig(), COLLECT_YEAR_OF_BIRTH: true },
          }}
        >
          <IntlProvider locale="en">
            <Provider store={mockStore(storeData)}>
              <ProfilePage {...requiredProfilePageProps} requiresParentalConsent />
            </Provider>
          </IntlProvider>
        </AppContext.Provider>
      );
      const wrapper = mount(component);
      wrapper.update();

      expect(wrapper.find('.alert-info').hasClass('show')).toBe(true);
    });
    it('test photo error alert', () => {
      const storeData = JSON.parse(JSON.stringify(storeMocks.viewOwnProfile));
      storeData.profilePage.errors.photo = { userMessage: 'error' };
      const component = (
        <AppContext.Provider
          value={{
            authenticatedUser: { userId: 123, username: 'staff', administrator: true },
            config: { ...getConfig(), COLLECT_YEAR_OF_BIRTH: true },
          }}
        >
          <IntlProvider locale="en">
            <Provider store={mockStore(storeData)}>
              <ProfilePage {...requiredProfilePageProps} />
            </Provider>
          </IntlProvider>
        </AppContext.Provider>
      );
      const wrapper = mount(component);
      wrapper.update();

      expect(wrapper.find('.alert-danger').hasClass('show')).toBe(true);
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
