import { call, put, takeEvery, delay } from 'redux-saga/effects';

import {
  SAVE_USER_PROFILE,
  saveUserProfileBegin,
  saveUserProfileSuccess,
  saveUserProfileFailure,
  saveUserProfileReset,
  closeEditableField,
} from '../actions/profileActions';

import * as UserProfileApiService from '../services/UserProfileApiService';

function* saveUserProfile(action) {
  try {
    yield put(saveUserProfileBegin());
    const userAccount = yield call(
      UserProfileApiService.saveUserProfile,
      action.payload.username,
      action.payload.userAccountState,
    );

    // Tells the profile form that
    yield put(saveUserProfileSuccess());
    // TODO: export the fetchUserAccountSuccess action from frontend-auth so we can
    // dry this up.
    yield put({
      type: 'FETCH_USER_ACCOUNT_SUCCESS',
      payload: { userAccount },
    });
    yield put(saveUserProfileReset());
    yield delay(300);
    yield put(closeEditableField(action.fieldName));
  } catch (e) {
    yield put(saveUserProfileFailure(e));
  }
}

export default function* rootSaga() {
  yield takeEvery(SAVE_USER_PROFILE.BASE, saveUserProfile);
}
