import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { IntlProvider } from 'react-intl';

import * as analytics from '../analytics';
import ConnectedProfilePage from './ProfilePage';
import { initialState as initialProfilePageState } from '../reducers/ProfilePageReducer';

const initialState = {
  profilePage: initialProfilePageState,
  userAccount: {},
  authentication: {},
};

const mockStore = configureMockStore();


describe('<ProfilePage />', () => {
  describe('handles analytics', () => {
    it('calls logEvent when mounting', () => {
      analytics.logEvent = jest.fn();
      mount((
        <IntlProvider locale="en">
          <Provider store={mockStore(initialState)}>
            <ConnectedProfilePage
              isCurrentUserProfile
              fetchProfile={() => []}
              saveProfile={() => []}
              saveProfilePhoto={() => []}
              deleteProfilePhoto={() => []}
              openField={() => []}
              closeField={() => []}
              match={{ params: { username: 'test-username' } }}
            />
          </Provider>
        </IntlProvider>
      ));

      expect(analytics.logEvent.mock.calls.length).toBe(1);
      expect(analytics.logEvent.mock.calls[0][0]).toEqual('edx.profile.viewed');
      expect(analytics.logEvent.mock.calls[0][1]).toEqual({
        profileUsername: 'test-username',
      });
    });
  });
});
