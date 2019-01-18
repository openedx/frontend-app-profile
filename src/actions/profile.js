import AsyncActionType from './AsyncActionType';

export const EDITABLE_FIELD_OPEN = 'EDITABLE_FIELD_OPEN';
export const EDITABLE_FIELD_CLOSE = 'EDITABLE_FIELD_CLOSE';
export const SAVE_USER_PROFILE = new AsyncActionType('PROFILE', 'SAVE_USER_PROFILE');

export const openEditableField = fieldName => ({
  type: EDITABLE_FIELD_OPEN,
  fieldName,
});

export const closeEditableField = fieldName => ({
  type: EDITABLE_FIELD_CLOSE,
  fieldName,
});

export const saveUserProfileBegin = () => ({
  type: SAVE_USER_PROFILE.BEGIN,
});

export const saveUserProfileSuccess = () => ({
  type: SAVE_USER_PROFILE.SUCCESS,
});

export const saveUserProfileReset = () => ({
  type: SAVE_USER_PROFILE.RESET,
});

export const saveUserProfileFailure = error => ({
  type: SAVE_USER_PROFILE.FAILURE,
  payload: { error },
});

export const saveUserProfile = (username, userAccountState, fieldName) => ({
  type: SAVE_USER_PROFILE.BASE,
  payload: {
    fieldName,
    username,
    userAccountState,
  },
});

