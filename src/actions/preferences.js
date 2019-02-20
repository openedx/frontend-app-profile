import AsyncActionType from './AsyncActionType';


export const FETCH_PREFERENCES = new AsyncActionType('PROFILE', 'FETCH_PREFERENCES');
export const SAVE_PREFERENCES = new AsyncActionType('PROFILE', 'SAVE_PREFERENCES');

export const fetchPreferencesBegin = () => ({
  type: FETCH_PREFERENCES.BEGIN,
});

export const fetchPreferencesSuccess = preferences => ({
  type: FETCH_PREFERENCES.SUCCESS,
  preferences,
});

export const fetchPreferencesFailure = error => ({
  type: FETCH_PREFERENCES.FAILURE,
  payload: { error },
});

export const fetchPreferencesReset = () => ({
  type: FETCH_PREFERENCES.RESET,
});

export const fetchPreferences = username => ({
  type: FETCH_PREFERENCES.BASE,
  payload: { username },
});


export const savePreferencesBegin = () => ({
  type: SAVE_PREFERENCES.BEGIN,
});

export const savePreferencesSuccess = () => ({
  type: SAVE_PREFERENCES.SUCCESS,
});

export const savePreferencesFailure = error => ({
  type: SAVE_PREFERENCES.FAILURE,
  payload: { error },
});

export const savePreferencesReset = () => ({
  type: SAVE_PREFERENCES.RESET,
});

export const savePreferences = (username, preferences) => ({
  type: SAVE_PREFERENCES.BASE,
  payload: { username, preferences },
});
