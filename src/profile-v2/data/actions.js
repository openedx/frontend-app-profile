import { AsyncActionType } from '../utils';

export const FETCH_PROFILE = new AsyncActionType('PROFILE', 'FETCH_PROFILE');
export const SAVE_PROFILE_PHOTO = new AsyncActionType('PROFILE', 'SAVE_PROFILE_PHOTO');
export const DELETE_PROFILE_PHOTO = new AsyncActionType('PROFILE', 'DELETE_PROFILE_PHOTO');

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
