import { all, call, put, takeEvery, delay } from 'redux-saga/effects';

import {
  FETCH_PROFILE,
  fetchProfileBegin,
  fetchProfileSuccess,
  receivePreferences,
  fetchProfileFailure,
  fetchProfileReset,
  fetchProfile as fetchProfileAction,
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


const PROP_TO_STATE_MAP = {
  fullName: 'name',
  userLocation: 'country',
  education: 'levelOfEducation',
  socialLinks: socialLinks => socialLinks.filter(({ socialLink }) => socialLink !== null),
};

export const mapDataForRequest = (props) => {
  const state = {};
  Object.keys(props).forEach((prop) => {
    const propModifier = PROP_TO_STATE_MAP[prop] || prop;
    if (typeof propModifier === 'function') {
      state[prop] = propModifier(props[prop]);
    } else {
      state[propModifier] = props[prop];
    }
  });
  return state;
};

export function* handleFetchProfile(action) {
  const { username } = action.payload;

  try {
    yield put(fetchProfileBegin());

    const [profile, preferences, certificates] = yield all([
      call(ProfileApiService.getProfile, username),
      call(ProfileApiService.getPreferences, username),
      call(ProfileApiService.getCourseCertificates, username),
    ]);

    profile.certificates = certificates;

    yield put(fetchProfileSuccess(profile));
    yield put(receivePreferences(preferences));
    yield put(fetchProfileReset());
  } catch (e) {
    yield put(fetchProfileFailure(e.message));
  }
}

export function* handleSaveProfile(action) {
  const { username, profileData, preferencesData } = action.payload;

  try {
    yield put(saveProfileBegin());
    const responseData = {};

    if (profileData != null) {
      responseData.profile = yield call(
        ProfileApiService.patchProfile,
        username,
        profileData,
      );
    }
    if (preferencesData != null) {
      responseData.preferences = yield call(
        ProfileApiService.patchPreferences,
        username,
        preferencesData,
      );
    }

    const { profile, preferences } = responseData;

    yield put(saveProfileSuccess());
    if (profile != null) {
      yield put(fetchProfileSuccess(profile));
    }
    if (preferences != null) {
      yield put(receivePreferences(preferences));
    }
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
