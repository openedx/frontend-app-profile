import { call, put, takeEvery, delay } from 'redux-saga/effects';
import { UserAccountApiService } from '@edx/frontend-auth';

import {
  SAVE_USER_PROFILE,
  saveUserProfileBegin,
  saveUserProfileSuccess,
  saveUserProfileFailure,
  saveUserProfileReset,
  closeEditableField,
  SAVE_USER_PROFILE_PHOTO,
  saveUserProfilePhotoBegin,
  saveUserProfilePhotoSuccess,
  saveUserProfilePhotoFailure,
  saveUserProfilePhotoReset,
} from '../actions/profile';
import apiClient from '../data/apiClient';

const apiService = new UserAccountApiService(apiClient, process.env.LMS_BASE_URL);

const PROP_TO_STATE_MAP = {
  fullName: 'name',
  userLocation: 'country',
  education: 'levelOfEducation',
  socialLinks: socialLinks => socialLinks.filter(({ socialLink }) => socialLink !== null),
};

const mapDataForRequest = (props) => {
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

function* saveUserProfile(action) {
  const { username, userAccountState } = action.payload;

  try {
    yield put(saveUserProfileBegin());

    // Use call([context, fnName], ...args) for proper context on apiService
    const userAccount = yield call(
      [apiService, 'saveUserAccount'],
      username,
      mapDataForRequest(userAccountState),
    );

    // Tells the profile form that
    yield put(saveUserProfileSuccess());
    // TODO: export the fetchUserAccountSuccess action from frontend-auth so we can
    // dry this up.
    yield put({
      type: 'FETCH_USER_ACCOUNT_SUCCESS',
      payload: { userAccount },
    });
    yield delay(300);
    yield put(closeEditableField(action.payload.fieldName));
    yield delay(300);
    yield put(saveUserProfileReset());
  } catch (e) {
    yield put(saveUserProfileFailure(e));
  }
}

function* saveUserProfilePhoto(action) {
  const { username, formData } = action.payload;

  try {
    yield put(saveUserProfilePhotoBegin());

    // Use call([context, fnName], ...args) for proper context on apiService
    yield call([apiService, 'saveUserProfilePhoto'], username, formData);

    // Get the account data. Saving doesn't return anything on success.
    const userAccount = yield call(
      [apiService, 'getUserAccount'],
      username,
    );

    yield put(saveUserProfilePhotoSuccess());
    // TODO: export the fetchUserAccountSuccess action from frontend-auth so we can
    // dry this up.
    yield put({
      type: 'FETCH_USER_ACCOUNT_SUCCESS',
      payload: { userAccount },
    });
    yield put(saveUserProfilePhotoReset());
  } catch (e) {
    yield put(saveUserProfilePhotoFailure(e));
  }
}

export default function* rootSaga() {
  yield takeEvery(SAVE_USER_PROFILE.BASE, saveUserProfile);
  yield takeEvery(SAVE_USER_PROFILE_PHOTO.BASE, saveUserProfilePhoto);
}
