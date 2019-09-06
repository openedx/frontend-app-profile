/* eslint-disable global-require */
import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { IntlProvider, configure as configureI18n } from '@edx/frontend-i18n';
import configureMockStore from 'redux-mock-store';

import * as analytics from '@edx/frontend-analytics';
import ConnectedProfilePage from './ProfilePage';
import configuration from '../../configuration';
import messages from '../../i18n';
import AuthenticationContext from '../../../frontend-core/AuthenticationContext';

const mockStore = configureMockStore();
const storeMocks = {
  loadingApp: require('./__mocks__/loadingApp.mockStore.js'),
  viewOwnProfile: require('./__mocks__/viewOwnProfile.mockStore.js'),
  viewOtherProfile: require('./__mocks__/viewOtherProfile.mockStore.js'),
  savingEditedBio: require('./__mocks__/savingEditedBio.mockStore.js'),
};
const requiredProfilePageProps = {
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
  value: `${configuration.LANGUAGE_PREFERENCE_COOKIE_NAME}=en`,
});

configureI18n(configuration, messages);

describe('<ProfilePage />', () => {
  describe('Renders correctly in various states', () => {
    it('app loading', () => {
      analytics.sendTrackingLogEvent = jest.fn();
      const component = (
        <AuthenticationContext.Provider
          value={{ userId: null, username: null, administrator: false }}
        >
          <IntlProvider locale="en">
            <Provider store={mockStore(storeMocks.loadingApp)}>
              <ConnectedProfilePage {...requiredProfilePageProps} />
            </Provider>
          </IntlProvider>
        </AuthenticationContext.Provider>
      );
      const tree = renderer.create(component).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('viewing own profile', () => {
      analytics.sendTrackingLogEvent = jest.fn();
      const component = (
        <AuthenticationContext.Provider
          value={{ userId: 123, username: 'staff', administrator: true }}
        >
          <IntlProvider locale="en">
            <Provider store={mockStore(storeMocks.viewOwnProfile)}>
              <ConnectedProfilePage {...requiredProfilePageProps} />
            </Provider>
          </IntlProvider>
        </AuthenticationContext.Provider>
      );
      const tree = renderer.create(component).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('viewing other profile', () => {
      analytics.sendTrackingLogEvent = jest.fn();
      const component = (
        <AuthenticationContext.Provider
          value={{ userId: 123, username: 'staff', administrator: true }}
        >
          <IntlProvider locale="en">
            <Provider store={mockStore(storeMocks.viewOtherProfile)}>
              <ConnectedProfilePage
                {...requiredProfilePageProps}
                match={{ params: { username: 'verified' } }} // Override default match
              />
            </Provider>
          </IntlProvider>
        </AuthenticationContext.Provider>
      );
      const tree = renderer.create(component).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('while saving an edited bio', () => {
      analytics.sendTrackingLogEvent = jest.fn();
      const component = (
        <AuthenticationContext.Provider
          value={{ userId: 123, username: 'staff', administrator: true }}
        >
          <IntlProvider locale="en">
            <Provider store={mockStore(storeMocks.savingEditedBio)}>
              <ConnectedProfilePage {...requiredProfilePageProps} />
            </Provider>
          </IntlProvider>
        </AuthenticationContext.Provider>
      );
      const tree = renderer.create(component).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('handles analytics', () => {
    it('calls sendTrackingLogEvent when mounting', () => {
      analytics.sendTrackingLogEvent = jest.fn();
      const component = (
        <AuthenticationContext.Provider
          value={{ userId: 123, username: 'staff', administrator: true }}
        >
          <IntlProvider locale="en">
            <Provider store={mockStore(storeMocks.loadingApp)}>
              <ConnectedProfilePage
                {...requiredProfilePageProps}
                match={{ params: { username: 'test-username' } }}
              />
            </Provider>
          </IntlProvider>
        </AuthenticationContext.Provider>
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
