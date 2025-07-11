import { history } from '@edx/frontend-platform';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import pick from 'lodash.pick';
import {
  all,
  call,
  delay,
  put,
  select,
  takeEvery,
} from 'redux-saga/effects';
import {
  closeForm,
  deleteProfilePhotoBegin,
  deleteProfilePhotoReset,
  deleteProfilePhotoSuccess,
  DELETE_PROFILE_PHOTO,
  fetchProfileBegin,
  fetchProfileReset,
  fetchProfileSuccess,
  FETCH_PROFILE,
  resetDrafts,
  saveProfileBegin,
  saveProfileFailure,
  saveProfileReset,
  saveProfileSuccess,
  SAVE_PROFILE,
  saveProfilePhotoBegin,
  saveProfilePhotoReset,
  saveProfilePhotoSuccess,
  SAVE_PROFILE_PHOTO,
} from './actions';
import { handleSaveProfileSelector, userAccountSelector } from './selectors';
import * as ProfileApiService from './services';

export function* handleFetchProfile(action) {
  const { username } = action.payload;
  const userAccount = yield select(userAccountSelector);
  const isAuthenticatedUserProfile = username === getAuthenticatedUser().username;
  let preferences = {};
  let account = userAccount;
  let courseCertificates = null;
  let countriesCodesList = [];

  try {
    yield put(fetchProfileBegin());

    const calls = [
      call(ProfileApiService.getAccount, username),
      call(ProfileApiService.getCourseCertificates, username),
      call(ProfileApiService.getCountryList),
    ];

    if (isAuthenticatedUserProfile) {
      calls.push(call(ProfileApiService.getPreferences, username));
    }

    const result = yield all(calls);

    if (isAuthenticatedUserProfile) {
      [account, courseCertificates, countriesCodesList, preferences] = result;
    } else {
      [account, courseCertificates, countriesCodesList] = result;
    }

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
      countriesCodesList,
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

export function* handleSaveProfile(action) {
  try {
    const { drafts, preferences } = yield select(handleSaveProfileSelector);

    const accountDrafts = pick(drafts, [
      'bio',
      'country',
      'levelOfEducation',
      'languageProficiencies',
      'name',
      'socialLinks',
    ]);

    const preferencesDrafts = pick(drafts, [
      'visibilityBio',
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

    if (Object.keys(accountDrafts).length > 0) {
      accountResult = yield call(
        ProfileApiService.patchProfile,
        action.payload.username,
        accountDrafts,
      );
    }

    let preferencesResult = preferences;
    if (Object.keys(preferencesDrafts).length > 0) {
      yield call(ProfileApiService.patchPreferences, action.payload.username, preferencesDrafts);
      // TODO: Temporary deoptimization since the patchPreferences call doesn't return anything.

      preferencesResult = yield call(ProfileApiService.getPreferences, action.payload.username);
    }

    yield put(saveProfileSuccess(accountResult, preferencesResult));
    yield delay(1000);
    yield put(closeForm(action.payload.formId));
    yield delay(300);
    yield put(saveProfileReset());
    yield put(resetDrafts());
  } catch (e) {
    if (e.processedData && e.processedData.fieldErrors) {
      yield put(saveProfileFailure(e.processedData.fieldErrors));
    } else {
      yield put(saveProfileReset());
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
    yield put(deleteProfilePhotoReset());
  }
}

export default function* profileSaga() {
  yield takeEvery(FETCH_PROFILE.BASE, handleFetchProfile);
  yield takeEvery(SAVE_PROFILE.BASE, handleSaveProfile);
  yield takeEvery(SAVE_PROFILE_PHOTO.BASE, handleSaveProfilePhoto);
  yield takeEvery(DELETE_PROFILE_PHOTO.BASE, handleDeleteProfilePhoto);
}
