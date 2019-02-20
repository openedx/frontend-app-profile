import { takeEvery, put, call, delay } from 'redux-saga/effects';

import rootSaga, { saveUserProfile, saveUserProfilePhoto, deleteUserProfilePhoto, mapDataForRequest } from './RootSaga';
import * as profileActions from '../actions/profile';

class MockUserAccountApiService {
  constructor() {
    this.saveUserAccount = jest.fn();
  }
}

describe('RootSaga', () => {
  describe('rootSaga', () => {
    it('should pass actions to the correct sagas', () => {
      const gen = rootSaga();
      // There is only one.
      expect(gen.next().value)
        .toEqual(takeEvery(profileActions.SAVE_USER_PROFILE.BASE, saveUserProfile));

      expect(gen.next().value)
        .toEqual(takeEvery(profileActions.SAVE_USER_PROFILE_PHOTO.BASE, saveUserProfilePhoto));

      expect(gen.next().value)
        .toEqual(takeEvery(profileActions.DELETE_USER_PROFILE_PHOTO.BASE, deleteUserProfilePhoto));
      // ... and done.
      expect(gen.next().value).toBeUndefined();
    });
  });

  describe('saveUserProfile', () => {
    it('should successfully process a saveUserProfile request if there are no exceptions', () => {
      const service = new MockUserAccountApiService();
      const rootGen = rootSaga(service);
      rootGen.next(); // Causes the service to be set.

      const action = profileActions.saveUserProfile(
        'my username',
        {
          fullName: 'Full Name',
          education: 'b',
        },
        'ze field',
      );
      const gen = saveUserProfile(action);
      const userAccount = {
        name: 'Full Name',
        levelOfEducation: 'b',
      };
      expect(gen.next().value).toEqual(put(profileActions.saveUserProfileBegin()));
      expect(gen.next().value).toEqual(call([service, 'saveUserAccount'], 'my username', userAccount));
      // The library would supply the result of the above call
      // as the parameter to the NEXT yield.  Here:
      expect(gen.next(userAccount).value).toEqual(put(profileActions.saveUserProfileSuccess()));
      expect(gen.next().value).toEqual(put({
        type: 'FETCH_USER_ACCOUNT_SUCCESS',
        payload: { userAccount },
      }));
      expect(gen.next().value).toEqual(delay(300));
      expect(gen.next().value).toEqual(put(profileActions.closeEditableField('ze field')));
      expect(gen.next().value).toEqual(delay(300));
      expect(gen.next().value).toEqual(put(profileActions.saveUserProfileReset()));
      expect(gen.next().value).toBeUndefined();
    });

    it('should successfully publish a failure action on exception', () => {
      const service = new MockUserAccountApiService();
      const error = new Error('uhoh');
      const rootGen = rootSaga(service);
      rootGen.next(); // Causes the service to be set.

      const action = profileActions.saveUserProfile(
        'my username',
        {
          fullName: 'Full Name',
          education: 'b',
        },
        'ze field',
      );
      const gen = saveUserProfile(action);

      expect(gen.next().value).toEqual(put(profileActions.saveUserProfileBegin()));
      const result = gen.throw(error);
      expect(result.value).toEqual(put(profileActions.saveUserProfileFailure(error)));
      expect(gen.next().value).toBeUndefined();
    });
  });

  describe('mapDataForRequest', () => {
    it('should modify props according to prop modifier strings and functions', () => {
      const props = {
        favoriteColor: 'red',
        age: 30,
        petName: 'Donkey',
        fullName: 'Donkey McWafflebatter',
        userLocation: 'US',
        education: 'BS',
        socialLinks: [
          {
            platform: 'twitter',
            socialLink: null,
          },
          {
            platform: 'facebook',
            socialLink: 'https://www.facebook.com',
          },
        ],
      };
      const result = mapDataForRequest(props);
      expect(result).toEqual({
        favoriteColor: 'red',
        age: 30,
        petName: 'Donkey',
        name: 'Donkey McWafflebatter',
        country: 'US',
        levelOfEducation: 'BS',
        socialLinks: [
          {
            platform: 'facebook',
            socialLink: 'https://www.facebook.com',
          },
        ],
      });
    });
  });
});
