import { history } from '@edx/frontend-platform';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import {
  all,
  call,
  put,
  select,
  takeEvery,
} from 'redux-saga/effects';
import {
  deleteProfilePhotoBegin,
  deleteProfilePhotoReset,
  deleteProfilePhotoSuccess,
  DELETE_PROFILE_PHOTO,
  fetchProfileBegin,
  fetchProfileReset,
  fetchProfileSuccess,
  FETCH_PROFILE,
  saveProfilePhotoBegin,
  saveProfilePhotoReset,
  saveProfilePhotoSuccess,
  SAVE_PROFILE_PHOTO,
} from './actions';
import { userAccountSelector } from './selectors';
import * as ProfileApiService from './services';

export function* handleFetchProfile(action) {
  const { username } = action.payload;
  const userAccount = yield select(userAccountSelector);
  const isAuthenticatedUserProfile = username === getAuthenticatedUser().username;
  // Default our data assuming the account is the current user's account.
  let preferences = {};
  let account = userAccount;
  let courseCertificates = null;

  try {
    yield put(fetchProfileBegin());

    // Depending on which profile we're loading, we need to make different calls.
    const calls = [
      call(ProfileApiService.getAccount, username),
      call(ProfileApiService.getCourseCertificates, username),
    ];

    if (isAuthenticatedUserProfile) {
      // If the profile is for the current user, get their preferences.
      // We don't need them for other users.
      calls.push(call(ProfileApiService.getPreferences, username));
    }

    // Make all the calls in parallel.
    const result = yield all(calls);

    if (isAuthenticatedUserProfile) {
      [account, courseCertificates, preferences] = result;
    } else {
      [account, courseCertificates] = result;
    }

    // Set initial visibility values for account
    // Set account_privacy as custom is necessary so that when viewing another user's profile,
    // their full name is displayed and change visibility forms are worked correctly
    if (isAuthenticatedUserProfile && result[0].accountPrivacy === 'all_users') {
      yield call(ProfileApiService.patchPreferences, action.payload.username, {
        account_privacy: 'custom',
        'visibility.name': 'all_users',
        'visibility.bio': 'all_users',
        'visibility.course_certificates': 'all_users',
        'visibility.country': 'all_users',
        'visibility.date_joined': 'all_users',
        'visibility.level_of_education': 'all_users',
        'visibility.language_proficiencies': 'all_users',
        'visibility.social_links': 'all_users',
        'visibility.time_zone': 'all_users',
      });
    }

    yield put(fetchProfileSuccess(
      account,
      preferences,
      courseCertificates,
      isAuthenticatedUserProfile,
    ));

    yield put(fetchProfileReset());
  } catch (e) {
    if (e.response.status === 404) {
      history.push('/notfound');
    } else {
      throw e;
    }
  }
}

export function* handleSaveProfilePhoto(action) {
  const { username, formData } = action.payload;

  try {
    yield put(saveProfilePhotoBegin());
    const photoResult = yield call(ProfileApiService.postProfilePhoto, username, formData);
    yield put(saveProfilePhotoSuccess(photoResult));
    yield put(saveProfilePhotoReset());
  } catch (e) {
    // Just reset on error, since editing functionality is deprecated
    yield put(saveProfilePhotoReset());
  }
}

export function* handleDeleteProfilePhoto(action) {
  const { username } = action.payload;

  try {
    yield put(deleteProfilePhotoBegin());
    const photoResult = yield call(ProfileApiService.deleteProfilePhoto, username);
    yield put(deleteProfilePhotoSuccess(photoResult));
    yield put(deleteProfilePhotoReset());
  } catch (e) {
    // Just reset on error, since editing functionality is deprecated
    yield put(deleteProfilePhotoReset());
  }
}

export default function* profileSaga() {
  yield takeEvery(FETCH_PROFILE.BASE, handleFetchProfile);
  yield takeEvery(SAVE_PROFILE_PHOTO.BASE, handleSaveProfilePhoto);
  yield takeEvery(DELETE_PROFILE_PHOTO.BASE, handleDeleteProfilePhoto);
}
