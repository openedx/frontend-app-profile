import { call, put, takeEvery, delay } from 'redux-saga/effects';
import { UserAccountApiService } from '@edx/frontend-auth';

import {
  SAVE_USER_PROFILE,
  saveUserProfileBegin,
  saveUserProfileSuccess,
  saveUserProfileFailure,
  saveUserProfileReset,
  closeEditableField,
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
  try {
    yield put(saveUserProfileBegin());
    const userAccount = yield call(
      // Because apiService is a class, 'this' needs to be bound.
      apiService.saveUserAccount.bind(apiService),
      action.payload.username,
      mapDataForRequest(action.payload.userAccountState),
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

export default function* rootSaga() {
  yield takeEvery(SAVE_USER_PROFILE.BASE, saveUserProfile);
}
