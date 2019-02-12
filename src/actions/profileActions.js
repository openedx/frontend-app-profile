import AsyncActionType from './AsyncActionType';


export const EDITABLE_FIELD = {
  OPEN: 'EDITABLE_FIELD_OPEN',
  CLOSE: 'EDITABLE_FIELD_CLOSE',
};


export const openEditableField = fieldName => ({
  type: EDITABLE_FIELD.OPEN,
  fieldName,
});

export const closeEditableField = fieldName => ({
  type: EDITABLE_FIELD.CLOSE,
  fieldName,
});


// TODO: DRY these actions up and remove them from frontend-auth.

export const SAVE_USER_PROFILE = new AsyncActionType('PROFILE', 'SAVE_USER_PROFILE');


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

export const saveUserProfile = (username, userAccountState, visibility, fieldName) => ({
  type: SAVE_USER_PROFILE.BASE,
  fieldName,
  payload: {
    username,
    userAccountState,
  },
});
