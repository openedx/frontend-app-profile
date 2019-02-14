import { call, put, takeEvery, delay } from 'redux-saga/effects';

import {
  SAVE_USER_PROFILE,
  saveUserProfileBegin,
  saveUserProfileSuccess,
  saveUserProfileFailure,
  saveUserProfileReset,
  closeEditableField,
} from '../actions/profile';

let userAccountApiService = null;

const PROP_TO_STATE_MAP = {
  fullName: 'name',
  userLocation: 'country',
  education: 'levelOfEducation',
  socialLinks: socialLinks =>
    Object.keys(socialLinks).map(linkKey => ({
      platform: linkKey,
      socialLink: socialLinks[linkKey].url,
    })),
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

export function* saveUserProfile(action) {
  try {
    yield put(saveUserProfileBegin());
    const userAccount = yield call(
      // Because apiService is a class, 'this' needs to be bound.
      userAccountApiService.saveUserAccount,
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

export default function* rootSaga(apiService) {
  userAccountApiService = apiService;
  yield takeEvery(SAVE_USER_PROFILE.BASE, saveUserProfile);
}
