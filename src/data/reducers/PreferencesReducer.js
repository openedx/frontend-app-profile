import defaultsDeep from 'lodash.defaultsdeep';

import {
  FETCH_PREFERENCES,
  SAVE_PREFERENCES,
} from '../../actions/preferences';


const initialState = {
  fetchPreferencesState: null,
  savePreferencesState: null,
};


const profile = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PREFERENCES.BEGIN:
      return {
        ...state,
        fetchPreferencesState: 'pending',
      };
    case FETCH_PREFERENCES.SUCCESS:
      return {
        ...state,
        fetchPreferencesState: 'complete',
        ...action.preferences,
      };
    case FETCH_PREFERENCES.FAILURE:
      return {
        ...state,
        fetchPreferencesState: 'error',
      };
    case FETCH_PREFERENCES.RESET:
      return {
        ...state,
        fetchPreferencesState: null,
        error: null,
      };

    case SAVE_PREFERENCES.BEGIN:
      return {
        ...state,
        savePreferencesState: 'pending',
      };
    case SAVE_PREFERENCES.SUCCESS:
      // defaults deep used because our preferences/state object is multi-dimensional
      return {
        ...defaultsDeep({}, action.preferences, state),
        savePreferencesState: 'complete',
      };
    case SAVE_PREFERENCES.FAILURE:
      return {
        ...state,
        savePreferencesState: 'error',
      };
    case SAVE_PREFERENCES.RESET:
      return {
        ...state,
        savePreferencesState: null,
        error: null,
      };

    default:
      return state;
  }
};

export default profile;
