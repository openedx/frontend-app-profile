import { call, put, takeEvery, delay } from 'redux-saga/effects';

import {
  FETCH_PROFILE,
  fetchProfileBegin,
  fetchProfileSuccess,
  fetchProfileFailure,
  fetchProfileReset,
  fetchProfile as fetchProfileAction,
  SAVE_PROFILE,
  saveProfileBegin,
  saveProfileSuccess,
  saveProfileFailure,
  saveProfileReset,
  closeEditableField,
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
} from '../actions/profile';

import * as ProfileApiService from '../services/ProfileApiService';

export function* handleFetchProfile(action) {
  const { username } = action.payload;

  try {
    yield put(fetchProfileBegin());
    const profile = yield call(
      ProfileApiService.getProfile,
      username,
    );

    yield put(fetchProfileSuccess(profile));
    yield put(fetchProfileReset());
  } catch (e) {
    yield put(fetchProfileFailure(e.message));
  }
}

export function* handleSaveProfile(action) {
  const { username, userAccountState } = action.payload;
  try {
    yield put(saveProfileBegin());
    const profile = yield call(
      ProfileApiService.patchProfile,
      username,
      userAccountState,
    );

    yield put(saveProfileSuccess());
    yield put(fetchProfileSuccess(profile));
    yield delay(300);
    yield put(closeEditableField(action.payload.fieldName));
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
    yield handleFetchProfile(fetchProfileAction);

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
    yield handleFetchProfile(fetchProfileAction);

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
