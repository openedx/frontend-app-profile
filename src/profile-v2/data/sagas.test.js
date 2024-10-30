import {
  takeEvery,
  put,
  call,
  select,
  all,
} from 'redux-saga/effects';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';

import * as profileActions from './actions';
import { userAccountSelector } from './selectors';

import profileSaga, {
  handleFetchProfile,
  handleSaveProfilePhoto,
  handleDeleteProfilePhoto,
} from './sagas';
import * as ProfileApiService from './services';
import {
  deleteProfilePhotoBegin,
  deleteProfilePhotoReset,
  saveProfilePhotoBegin,
  saveProfilePhotoReset,
} from './actions';

jest.mock('./services', () => ({
  getAccount: jest.fn(),
  getCourseCertificates: jest.fn(),
  getPreferences: jest.fn(),
  postProfilePhoto: jest.fn(),
  deleteProfilePhoto: jest.fn(),
}));

jest.mock('@edx/frontend-platform/auth', () => ({
  getAuthenticatedUser: jest.fn(),
}));

describe('RootSaga', () => {
  describe('profileSaga', () => {
    it('should pass actions to the correct sagas', () => {
      const gen = profileSaga();

      expect(gen.next().value)
        .toEqual(takeEvery(profileActions.FETCH_PROFILE.BASE, handleFetchProfile));
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

  describe('handleSaveProfilePhoto', () => {
    it('should publish a reset action on error', () => {
      const action = profileActions.saveProfilePhoto('my username', {});
      const gen = handleSaveProfilePhoto(action);
      const error = new Error('Error occurred');

      expect(gen.next().value).toEqual(put(saveProfilePhotoBegin()));
      expect(gen.throw(error).value).toEqual(put(saveProfilePhotoReset()));
      expect(gen.next().value).toBeUndefined();
    });
  });

  describe('handleDeleteProfilePhoto', () => {
    it('should publish a reset action on error', () => {
      const action = profileActions.deleteProfilePhoto('my username');
      const gen = handleDeleteProfilePhoto(action);
      const error = new Error('Error occurred');

      expect(gen.next().value).toEqual(put(deleteProfilePhotoBegin()));
      expect(gen.throw(error).value).toEqual(put(deleteProfilePhotoReset()));
      expect(gen.next().value).toBeUndefined();
    });
  });

  describe('handleDeleteProfilePhoto', () => {
    it('should successfully process a deleteProfilePhoto request if there are no exceptions', () => {
      const action = profileActions.deleteProfilePhoto('my username');
      const gen = handleDeleteProfilePhoto(action);
      const photoResult = {};

      expect(gen.next().value).toEqual(put(profileActions.deleteProfilePhotoBegin()));
      expect(gen.next().value).toEqual(call(ProfileApiService.deleteProfilePhoto, 'my username'));
      expect(gen.next(photoResult).value).toEqual(put(profileActions.deleteProfilePhotoSuccess(photoResult)));
      expect(gen.next().value).toEqual(put(profileActions.deleteProfilePhotoReset()));
      expect(gen.next().value).toBeUndefined();
    });

    it('should publish a failure action on exception', () => {
      const error = new Error('Error occurred');
      const action = profileActions.deleteProfilePhoto('my username');
      const gen = handleDeleteProfilePhoto(action);

      expect(gen.next().value).toEqual(put(profileActions.deleteProfilePhotoBegin()));
      const result = gen.throw(error);
      expect(result.value).toEqual(put(profileActions.deleteProfilePhotoReset()));
      expect(gen.next().value).toBeUndefined();
    });
  });
});
