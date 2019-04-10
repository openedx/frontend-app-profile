import { push } from 'connected-react-router';
import { all, call, delay, put, select, takeEvery } from 'redux-saga/effects';
import LoggingService from '@edx/frontend-logging';

// Actions
import {
  FETCH_PROFILE,
  fetchProfileBegin,
  fetchProfileSuccess,
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
  deleteProfilePhotoReset,
  resetDrafts,
} from '../actions/ProfileActions';

// Selectors
import { handleSaveProfileSelector, handleFetchProfileSelector } from '../selectors/ProfilePageSelector';

// Services
import * as ProfileApiService from '../services/ProfileApiService';

// Utils
import { keepKeys } from '../services/utils';

export function* handleFetchProfile(action) {
  const { username } = action.payload;
  const { isAuthenticatedUserProfile, userAccount } = yield select(handleFetchProfileSelector);

  // Default our data assuming the account is the current user's account.
  let preferences = {};
  let account = userAccount;
  let courseCertificates = null;

  try {
    yield put(fetchProfileBegin());

    // Depending on which profile we're loading, we need to make different calls.
    const calls = [
      // We'll always make a call for certificates.
      call(ProfileApiService.getCourseCertificates, username),
    ];

    if (isAuthenticatedUserProfile) {
      // If the profile is for the current user, get their preferences.
      // We don't need them for other users.
      calls.push(call(ProfileApiService.getPreferences, username));
    } else {
      // If the profile is not for the current user, get that user's account data
      // since we don't already have it.
      calls.push(call(ProfileApiService.getAccount, username));
    }

    // Make all the calls in parallel.
    const result = yield all(calls);

    if (isAuthenticatedUserProfile) {
      [courseCertificates, preferences] = result;
    } else {
      [courseCertificates, account] = result;
    }
    yield put(fetchProfileSuccess(account, preferences, courseCertificates));

    yield put(fetchProfileReset());
  } catch (e) {
    LoggingService.logAPIErrorResponse(e);
    if (e.response.status === 404) {
      yield put(push('/notfound'));
    } else {
      yield put(push('/error'));
    }
  }
}

export function* handleSaveProfile(action) {
  try {
    const { username, drafts, preferences } = yield select(handleSaveProfileSelector);

    const accountDrafts = keepKeys(drafts, [
      'bio',
      'courseCertificates',
      'country',
      'levelOfEducation',
      'languageProficiencies',
      'name',
      'socialLinks',
    ]);

    const preferencesDrafts = keepKeys(drafts, [
      'visibilityBio',
      'visibilityCourseCertificates',
      'visibilityCountry',
      'visibilityLevelOfEducation',
      'visibilityLanguageProficiencies',
      'visibilityName',
      'visibilitySocialLinks',
    ]);

    if (Object.keys(preferencesDrafts).length > 0) {
      preferencesDrafts.accountPrivacy = 'custom';
    }

    yield put(saveProfileBegin());
    let accountResult = null;
    // Build the visibility drafts into a structure the API expects.

    if (Object.keys(accountDrafts).length > 0) {
      accountResult = yield call(ProfileApiService.patchProfile, username, accountDrafts);
    }

    let preferencesResult = preferences; // assume it hasn't changed.
    if (Object.keys(preferencesDrafts).length > 0) {
      yield call(ProfileApiService.patchPreferences, username, preferencesDrafts);
      // TODO: Temporary deoptimization since the patchPreferences call doesn't return anything.
      // Remove this second call once we can get a result from the one above.
      preferencesResult = yield call(ProfileApiService.getPreferences, username);
    }

    // The account result is returned from the server.
    // The preferences draft is valid if the server didn't complain, so
    // pass it through directly.
    yield put(saveProfileSuccess(accountResult, preferencesResult));
    yield delay(300);
    yield put(closeForm(action.payload.formId));
    yield delay(300);
    yield put(saveProfileReset());
    yield put(resetDrafts());
  } catch (e) {
    if (e.processedData && e.processedData.fieldErrors) {
      yield put(saveProfileFailure(e.processedData.fieldErrors));
    } else {
      LoggingService.logAPIErrorResponse(e);
      yield put(saveProfileReset());
      yield put(push('/error'));
    }
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
    if (e.processedData) {
      yield put(saveProfilePhotoFailure(e.processedData));
    } else {
      LoggingService.logAPIErrorResponse(e);
      yield put(saveProfilePhotoReset());
      yield put(push('/error'));
    }
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
    LoggingService.logAPIErrorResponse(e);
    yield put(deleteProfilePhotoReset());
    yield put(push('/error'));
  }
}

export default function* rootSaga() {
  yield takeEvery(FETCH_PROFILE.BASE, handleFetchProfile);
  yield takeEvery(SAVE_PROFILE.BASE, handleSaveProfile);
  yield takeEvery(SAVE_PROFILE_PHOTO.BASE, handleSaveProfilePhoto);
  yield takeEvery(DELETE_PROFILE_PHOTO.BASE, handleDeleteProfilePhoto);
}
