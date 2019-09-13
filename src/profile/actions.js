import { AsyncActionType } from '../utils';

export const FETCH_PROFILE = new AsyncActionType('PROFILE', 'FETCH_PROFILE');
export const SAVE_PROFILE = new AsyncActionType('PROFILE', 'SAVE_PROFILE');
export const SAVE_PROFILE_PHOTO = new AsyncActionType('PROFILE', 'SAVE_PROFILE_PHOTO');
export const DELETE_PROFILE_PHOTO = new AsyncActionType('PROFILE', 'DELETE_PROFILE_PHOTO');
export const OPEN_FORM = 'OPEN_FORM';
export const CLOSE_FORM = 'CLOSE_FORM';
export const UPDATE_DRAFT = 'UPDATE_DRAFT';
export const RESET_DRAFTS = 'RESET_DRAFTS';

// FETCH PROFILE ACTIONS

export const fetchProfile = username => ({
  type: FETCH_PROFILE.BASE,
  payload: { username },
});

export const fetchProfileBegin = () => ({
  type: FETCH_PROFILE.BEGIN,
});

export const fetchProfileSuccess = (
  account,
  preferences,
  courseCertificates,
  isAuthenticatedUserProfile,
) => ({
  type: FETCH_PROFILE.SUCCESS,
  account,
  preferences,
  courseCertificates,
  isAuthenticatedUserProfile,
});

export const fetchProfileReset = () => ({
  type: FETCH_PROFILE.RESET,
});

// SAVE PROFILE ACTIONS

export const saveProfile = (formId, username) => ({
  type: SAVE_PROFILE.BASE,
  payload: {
    formId,
    username,
  },
});

export const saveProfileBegin = () => ({
  type: SAVE_PROFILE.BEGIN,
});

export const saveProfileSuccess = (account, preferences) => ({
  type: SAVE_PROFILE.SUCCESS,
  payload: {
    account,
    preferences,
  },
});

export const saveProfileReset = () => ({
  type: SAVE_PROFILE.RESET,
});

export const saveProfileFailure = errors => ({
  type: SAVE_PROFILE.FAILURE,
  payload: { errors },
});

// SAVE PROFILE PHOTO ACTIONS

export const saveProfilePhoto = (username, formData) => ({
  type: SAVE_PROFILE_PHOTO.BASE,
  payload: {
    username,
    formData,
  },
});

export const saveProfilePhotoBegin = () => ({
  type: SAVE_PROFILE_PHOTO.BEGIN,
});

export const saveProfilePhotoSuccess = profileImage => ({
  type: SAVE_PROFILE_PHOTO.SUCCESS,
  payload: { profileImage },
});

export const saveProfilePhotoReset = () => ({
  type: SAVE_PROFILE_PHOTO.RESET,
});

export const saveProfilePhotoFailure = error => ({
  type: SAVE_PROFILE_PHOTO.FAILURE,
  payload: { error },
});

// DELETE PROFILE PHOTO ACTIONS

export const deleteProfilePhoto = username => ({
  type: DELETE_PROFILE_PHOTO.BASE,
  payload: {
    username,
  },
});

export const deleteProfilePhotoBegin = () => ({
  type: DELETE_PROFILE_PHOTO.BEGIN,
});

export const deleteProfilePhotoSuccess = profileImage => ({
  type: DELETE_PROFILE_PHOTO.SUCCESS,
  payload: { profileImage },
});

export const deleteProfilePhotoReset = () => ({
  type: DELETE_PROFILE_PHOTO.RESET,
});

// FIELD STATE ACTIONS

export const openForm = formId => ({
  type: OPEN_FORM,
  payload: {
    formId,
  },
});

export const closeForm = formId => ({
  type: CLOSE_FORM,
  payload: {
    formId,
  },
});

// FORM STATE ACTIONS

export const updateDraft = (name, value) => ({
  type: UPDATE_DRAFT,
  payload: {
    name,
    value,
  },
});

export const resetDrafts = () => ({
  type: RESET_DRAFTS,
});
