import AsyncActionType from './AsyncActionType';

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

export const saveUserProfile = (username, userAccountState) => ({
  type: SAVE_USER_PROFILE.BASE,
  payload: {
    username,
    userAccountState,
  },
});
