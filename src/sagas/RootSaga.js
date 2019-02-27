import { all, call, delay, put, select, takeEvery } from 'redux-saga/effects';

// Actions
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
  closeForm,
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
  resetDrafts,
} from '../actions/ProfileActions';

// Selectors
import { handleSaveProfileSelector } from '../selectors/ProfilePageSelector';

// Services
import * as ProfileApiService from '../services/ProfileApiService';

export function* handleFetchProfile(action) {
  const { username } = action.payload;
  const currentUsername = yield select(state => state.authentication.username); // eslint-disable-line

  try {
    yield put(fetchProfileBegin());

    const calls = [
      call(ProfileApiService.getAccount, username),
      call(ProfileApiService.getCourseCertificates, username),
    ];

    if (username === currentUsername) {
      calls.push(call(ProfileApiService.getPreferences, username));
    }

    const result = yield all(calls);

    if (result.length > 2) {
      const [account, certificates, preferences] = result;
      yield put(fetchProfileSuccess(account, preferences, certificates));
    } else {
      const [account, certificates] = result;
      yield put(fetchProfileSuccess(account, { visibility: {} }, certificates));
    }

    yield put(fetchProfileReset());
  } catch (e) {
    yield put(fetchProfileFailure(e.message));
  }
}

export function* handleSaveProfile(action) {
  const { username, accountDrafts, visibilityDrafts } = yield select(handleSaveProfileSelector);

  try {
    yield put(saveProfileBegin());
    let accountResult = null;
    // Build the visibility drafts into a structure the API expects.
    const preferences = {
      visibility: visibilityDrafts,
    };

    if (Object.keys(accountDrafts).length > 0) {
      accountResult = yield call(ProfileApiService.patchProfile, username, accountDrafts);
    }

    if (Object.keys(visibilityDrafts).length > 0) {
      yield call(ProfileApiService.patchPreferences, username, preferences);
    }

    // The account result is returned from the server.
    // The preferences draft is valid if the server didn't complain, so
    // pass it through directly.
    yield put(saveProfileSuccess(accountResult, preferences));
    yield delay(300);
    yield put(closeForm(action.payload.formId));
    yield delay(300);
    yield put(saveProfileReset());
    yield put(resetDrafts());
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
    yield handleFetchProfile(fetchProfile(username));

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
    yield handleFetchProfile(fetchProfile(username));

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
