import {
  takeEvery,
  put,
  call,
  delay,
  select,
  all,
} from 'redux-saga/effects';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';

import * as profileActions from './actions';
import { handleSaveProfileSelector, userAccountSelector } from './selectors';

jest.mock('./services', () => ({
  getProfile: jest.fn(),
  patchProfile: jest.fn(),
  postProfilePhoto: jest.fn(),
  deleteProfilePhoto: jest.fn(),
  getPreferences: jest.fn(),
  getAccount: jest.fn(),
  getCourseCertificates: jest.fn(),
}));

jest.mock('@edx/frontend-platform/auth', () => ({
  getAuthenticatedUser: jest.fn(),
}));

// RootSaga and ProfileApiService must be imported AFTER the mock above.
/* eslint-disable import/first */
import profileSaga, {
  handleFetchProfile,
  handleSaveProfile,
  handleSaveProfilePhoto,
  handleDeleteProfilePhoto,
} from './sagas';
import * as ProfileApiService from './services';
/* eslint-enable import/first */

describe('RootSaga', () => {
  describe('profileSaga', () => {
    it('should pass actions to the correct sagas', () => {
      const gen = profileSaga();

      expect(gen.next().value)
        .toEqual(takeEvery(profileActions.FETCH_PROFILE.BASE, handleFetchProfile));
      expect(gen.next().value)
        .toEqual(takeEvery(profileActions.SAVE_PROFILE.BASE, handleSaveProfile));
      expect(gen.next().value)
        .toEqual(takeEvery(profileActions.SAVE_PROFILE_PHOTO.BASE, handleSaveProfilePhoto));
      expect(gen.next().value)
        .toEqual(takeEvery(profileActions.DELETE_PROFILE_PHOTO.BASE, handleDeleteProfilePhoto));

      expect(gen.next().value).toBeUndefined();
    });
  });

  describe('handleFetchProfile', () => {
    it('should fetch certificates and preferences for the current user profile', () => {
      const userAccount = {
        username: 'gonzo',
        other: 'data',
      };
      getAuthenticatedUser.mockReturnValue(userAccount);
      const selectorData = {
        userAccount,
      };

      const action = profileActions.fetchProfile('gonzo');
      const gen = handleFetchProfile(action);

      const result = [userAccount, [1, 2, 3], { preferences: 'stuff' }];

      expect(gen.next().value).toEqual(select(userAccountSelector));
      expect(gen.next(selectorData).value).toEqual(put(profileActions.fetchProfileBegin()));
      expect(gen.next().value).toEqual(all([
        call(ProfileApiService.getAccount, 'gonzo'),
        call(ProfileApiService.getCourseCertificates, 'gonzo'),
        call(ProfileApiService.getPreferences, 'gonzo'),
      ]));
      expect(gen.next(result).value)
        .toEqual(put(profileActions.fetchProfileSuccess(userAccount, result[2], result[1], true)));
      expect(gen.next().value).toEqual(put(profileActions.fetchProfileReset()));
      expect(gen.next().value).toBeUndefined();
    });

    it('should fetch certificates and profile for some other user profile', () => {
      const userAccount = {
        username: 'gonzo',
        other: 'data',
      };
      getAuthenticatedUser.mockReturnValue(userAccount);
      const selectorData = {
        userAccount,
      };

      const action = profileActions.fetchProfile('booyah');
      const gen = handleFetchProfile(action);

      const result = [{}, [1, 2, 3]];

      expect(gen.next().value).toEqual(select(userAccountSelector));
      expect(gen.next(selectorData).value).toEqual(put(profileActions.fetchProfileBegin()));
      expect(gen.next().value).toEqual(all([
        call(ProfileApiService.getAccount, 'booyah'),
        call(ProfileApiService.getCourseCertificates, 'booyah'),
      ]));
      expect(gen.next(result).value)
        .toEqual(put(profileActions.fetchProfileSuccess(result[0], {}, result[1], false)));
      expect(gen.next().value).toEqual(put(profileActions.fetchProfileReset()));
      expect(gen.next().value).toBeUndefined();
    });
  });

  describe('handleSaveProfile', () => {
    const selectorData = {
      username: 'my username',
      drafts: {
        name: 'Full Name',
      },
      preferences: {},
    };

    it('should successfully process a saveProfile request if there are no exceptions', () => {
      const action = profileActions.saveProfile('ze form id', 'my username');
      const gen = handleSaveProfile(action);
      const profile = {
        name: 'Full Name',
        levelOfEducation: 'b',
      };
      expect(gen.next().value).toEqual(select(handleSaveProfileSelector));
      expect(gen.next(selectorData).value).toEqual(put(profileActions.saveProfileBegin()));
      expect(gen.next().value).toEqual(call(ProfileApiService.patchProfile, 'my username', {
        name: 'Full Name',
      }));
      // The library would supply the result of the above call
      // as the parameter to the NEXT yield.  Here:
      expect(gen.next(profile).value).toEqual(put(profileActions.saveProfileSuccess(profile, {})));
      expect(gen.next().value).toEqual(delay(1000));
      expect(gen.next().value).toEqual(put(profileActions.closeForm('ze form id')));
      expect(gen.next().value).toEqual(delay(300));
      expect(gen.next().value).toEqual(put(profileActions.saveProfileReset()));
      expect(gen.next().value).toEqual(put(profileActions.resetDrafts()));
      expect(gen.next().value).toBeUndefined();
    });

    it('should successfully publish a failure action on exception', () => {
      const error = new Error('uhoh');
      error.processedData = {
        fieldErrors: {
          uhoh: 'not good',
        },
      };
      const action = profileActions.saveProfile(
        'ze form id',
        'my username',
      );
      const gen = handleSaveProfile(action);

      expect(gen.next().value).toEqual(select(handleSaveProfileSelector));
      expect(gen.next(selectorData).value).toEqual(put(profileActions.saveProfileBegin()));
      const result = gen.throw(error);
      expect(result.value).toEqual(put(profileActions.saveProfileFailure({ uhoh: 'not good' })));
      expect(gen.next().value).toBeUndefined();
    });
  });
});
