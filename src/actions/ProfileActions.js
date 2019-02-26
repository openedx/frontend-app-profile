import AsyncActionType from './AsyncActionType';

export const FETCH_PROFILE = new AsyncActionType('PROFILE', 'FETCH_PROFILE');
export const SAVE_PROFILE = new AsyncActionType('PROFILE', 'SAVE_PROFILE');
export const SAVE_PROFILE_PHOTO = new AsyncActionType('PROFILE', 'SAVE_PROFILE_PHOTO');
export const DELETE_PROFILE_PHOTO = new AsyncActionType('PROFILE', 'DELETE_PROFILE_PHOTO');
export const FIELD_OPEN = 'FIELD_OPEN';
export const FIELD_CLOSE = 'FIELD_CLOSE';
export const UPDATE_DRAFTS = 'UPDATE_DRAFTS';

// FETCH PROFILE ACTIONS

export const fetchProfile = username => ({
  type: FETCH_PROFILE.BASE,
  payload: { username },
});

export const fetchProfileBegin = () => ({
  type: FETCH_PROFILE.BEGIN,
});

export const fetchProfileSuccess = (account, preferences, certificates) => ({
  type: FETCH_PROFILE.SUCCESS,
  account,
  preferences,
  certificates,
});

export const fetchProfileFailure = error => ({
  type: FETCH_PROFILE.FAILURE,
  payload: { error },
});

export const fetchProfileReset = () => ({
  type: FETCH_PROFILE.RESET,
});

// SAVE PROFILE ACTIONS

export const saveProfile = (username, draftAccount, draftPreferences, fieldName) => ({
  type: SAVE_PROFILE.BASE,
  payload: {
    fieldName,
    username,
    draftAccount,
    draftPreferences,
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

export const saveProfileFailure = error => ({
  type: SAVE_PROFILE.FAILURE,
  payload: { error },
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

export const saveProfilePhotoSuccess = () => ({
  type: SAVE_PROFILE_PHOTO.SUCCESS,
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

export const deleteProfilePhotoSuccess = () => ({
  type: DELETE_PROFILE_PHOTO.SUCCESS,
});

export const deleteProfilePhotoReset = () => ({
  type: DELETE_PROFILE_PHOTO.RESET,
});

export const deleteProfilePhotoFailure = error => ({
  type: DELETE_PROFILE_PHOTO.FAILURE,
  payload: { error },
});

// FIELD STATE ACTIONS

export const openField = fieldName => ({
  type: FIELD_OPEN,
  fieldName,
});

export const closeField = fieldName => ({
  type: FIELD_CLOSE,
  fieldName,
});

// FORM STATE ACTIONS

export const updateDrafts = drafts => ({
  type: UPDATE_DRAFTS,
  drafts,
});
