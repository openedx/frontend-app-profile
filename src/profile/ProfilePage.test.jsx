/* eslint-disable global-require */
import * as analytics from '@edx/frontend-analytics';
import { App, AppContext } from '@edx/frontend-base';
import { configure as configureI18n, IntlProvider } from '@edx/frontend-i18n';
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
  value: `${App.config.LANGUAGE_PREFERENCE_COOKIE_NAME}=en`,
});
App.apiClient = jest.fn();

configureI18n(App.config, messages);

describe('<ProfilePage />', () => {
  describe('Renders correctly in various states', () => {
    it('app loading', () => {
      analytics.sendTrackingLogEvent = jest.fn();
      const component = (
        <AppContext.Provider
          value={{
            authenticatedUser: { userId: null, username: null, administrator: false },
            config: App.config,
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
      analytics.sendTrackingLogEvent = jest.fn();
      const component = (
        <AppContext.Provider
          value={{
            authenticatedUser: { userId: 123, username: 'staff', administrator: true },
            config: App.config,
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
      analytics.sendTrackingLogEvent = jest.fn();
      const component = (
        <AppContext.Provider
          value={{
            authenticatedUser: { userId: 123, username: 'staff', administrator: true },
            config: App.config,
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
      analytics.sendTrackingLogEvent = jest.fn();
      const component = (
        <AppContext.Provider
          value={{
            authenticatedUser: { userId: 123, username: 'staff', administrator: true },
            config: App.config,
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
  });

  describe('handles analytics', () => {
    it('calls sendTrackingLogEvent when mounting', () => {
      analytics.sendTrackingLogEvent = jest.fn();
      const component = (
        <AppContext.Provider
          value={{
            authenticatedUser: { userId: 123, username: 'staff', administrator: true },
            config: App.config,
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
      mount(component);

      expect(analytics.sendTrackingLogEvent.mock.calls.length).toBe(1);
      expect(analytics.sendTrackingLogEvent.mock.calls[0][0]).toEqual('edx.profile.viewed');
      expect(analytics.sendTrackingLogEvent.mock.calls[0][1]).toEqual({
        username: 'test-username',
      });
    });
  });
});
