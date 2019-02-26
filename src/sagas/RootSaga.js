import { all, call, put, takeEvery, delay } from 'redux-saga/effects';

import {
  FETCH_PROFILE,
  fetchProfileBegin,
  fetchProfileSuccess,
  fetchProfileFailure,
  fetchProfileReset,
  fetchProfile,
  SAVE_PROFILE,
  saveProfileBegin,
  saveProfileSuccess,
  saveProfileFailure,
  saveProfileReset,
  closeField,
  SAVE_PROFILE_PHOTO,
  saveProfilePhotoBegin,
  saveProfilePhotoSuccess,
  saveProfilePhotoFailure,
  saveProfilePhotoReset,
  DELETE_PROFILE_PHOTO,
  deleteProfilePhotoBegin,
  deleteProfilePhotoSuccess,
  deleteProfilePhotoFailure,
  deleteProfilePhotoReset,
} from '../actions/ProfileActions';

import * as ProfileApiService from '../services/ProfileApiService';

export function* handleFetchProfile(action) {
  const { username } = action.payload;

  try {
    yield put(fetchProfileBegin());

    const [account, preferences, certificates] = yield all([
      call(ProfileApiService.getAccount, username),
      call(ProfileApiService.getPreferences, username),
      call(ProfileApiService.getCourseCertificates, username),
    ]);

    yield put(fetchProfileSuccess(account, preferences, certificates));
    yield put(fetchProfileReset());
  } catch (e) {
    yield put(fetchProfileFailure(e.message));
  }
}

export function* handleSaveProfile(action) {
  const { username, draftAccount, draftPreferences } = action.payload;

  try {
    yield put(saveProfileBegin());
    let accountResult = null;

    if (draftAccount !== null) {
      accountResult = yield call(
        ProfileApiService.patchProfile,
        username,
        draftAccount,
      );
    }

    if (draftPreferences !== null) {
      yield call(
        ProfileApiService.patchPreferences,
        username,
        draftPreferences,
      );
    }

    // The account result is returned from the server.
    // The preferences draft is valid if the server didn't complain, so
    // pass it through directly.
    yield put(saveProfileSuccess(accountResult, draftPreferences));
    yield delay(300);
    yield put(closeField(action.payload.fieldName));
    yield delay(300);
    yield put(saveProfileReset());
  } catch (e) {
    yield put(saveProfileFailure(e.message));
  }
}

export function* handleSaveProfilePhoto(action) {
  const { username, formData } = action.payload;

  try {
    yield put(saveProfilePhotoBegin());
    yield call(ProfileApiService.postProfilePhoto, username, formData);

    // Get the account data. Saving doesn't return anything on success.
    yield handleFetchProfile(fetchProfile);

    yield put(saveProfilePhotoSuccess());
    yield put(saveProfilePhotoReset());
  } catch (e) {
    yield put(saveProfilePhotoFailure(e.message));
  }
}

export function* handleDeleteProfilePhoto(action) {
  const { username } = action.payload;

  try {
    yield put(deleteProfilePhotoBegin());
    yield call(ProfileApiService.deleteProfilePhoto, username);

    // Get the account data. Saving doesn't return anything on success.
    yield handleFetchProfile(fetchProfile);

    yield put(deleteProfilePhotoSuccess());
    yield put(deleteProfilePhotoReset());
  } catch (e) {
    yield put(deleteProfilePhotoFailure(e.message));
  }
}

export default function* rootSaga() {
  yield takeEvery(FETCH_PROFILE.BASE, handleFetchProfile);
  yield takeEvery(SAVE_PROFILE.BASE, handleSaveProfile);
  yield takeEvery(SAVE_PROFILE_PHOTO.BASE, handleSaveProfilePhoto);
  yield takeEvery(DELETE_PROFILE_PHOTO.BASE, handleDeleteProfilePhoto);
}
