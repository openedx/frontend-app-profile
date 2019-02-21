import defaultsDeep from 'lodash.defaultsdeep';

import {
  SAVE_PROFILE,
  SAVE_PROFILE_PHOTO,
  DELETE_PROFILE_PHOTO,
  EDITABLE_FIELD_CLOSE,
  EDITABLE_FIELD_OPEN,
  FETCH_PROFILE,
} from '../../actions/profile';

import {
  FETCH_PREFERENCES,
  SAVE_PREFERENCES,
} from '../../actions/preferences';

const initialState = {
  error: null,
  saveState: null,
  savePhotoState: null,
  savePreferencesState: null,
  saveProfileState: null,
  currentlyEditingField: null,
  profile: {},
  preferences: {},
};

// This function returns state based on priority:
// if any are pending > the state is pending
// then, if any are errors > the state is error
// then, if any are complete > the state is complete
// else null
const mergeSaveStates = (statesToMerge) => {
  const statePriority = ['pending', 'error', 'complete', null];
  statesToMerge.sort((a, b) => statePriority.indexOf(a) - statePriority.indexOf(b));
  return statesToMerge[0];
};

const profilePage = (state = initialState, action) => {
  switch (action.type) {
    case EDITABLE_FIELD_OPEN:
      return {
        ...state,
        currentlyEditingField: action.fieldName,
      };
    case EDITABLE_FIELD_CLOSE:
      // Only close if the field to close is undefined or matches the field that is currently open
      if (action.fieldName === state.currentlyEditingField) {
        return {
          ...state,
          currentlyEditingField: null,
        };
      }
      return state;

    case FETCH_PREFERENCES.SUCCESS:
      return {
        ...state,
        preferences: action.preferences,
      };

    case SAVE_PREFERENCES.BEGIN:
      return {
        ...state,
        savePreferencesState: 'pending',
        saveState: mergeSaveStates(['pending', state.saveProfileState]),
      };
    case SAVE_PREFERENCES.SUCCESS:
      // defaults deep used because our preferences/state object is multi-dimensional
      return {
        ...state,
        preferences: defaultsDeep({}, action.preferences, state.preferences),
        savePreferencesState: 'complete',
        saveState: mergeSaveStates(['complete', state.saveProfileState]),
      };
    case SAVE_PREFERENCES.FAILURE:
      return {
        ...state,
        savePreferencesState: 'error',
        saveState: mergeSaveStates(['error', state.saveProfileState]),
      };
    case SAVE_PREFERENCES.RESET:
      return {
        ...state,
        savePreferencesState: null,
        saveState: mergeSaveStates([null, state.saveProfileState]),
        error: null,
      };

    case FETCH_PROFILE.SUCCESS:
      return {
        ...state,
        profile: action.payload.profile,
      };

    case SAVE_PROFILE.BEGIN:
      return {
        ...state,
        saveProfileState: 'pending',
        saveState: mergeSaveStates(['pending', state.savePreferencesState]),
        error: null,
      };
    case SAVE_PROFILE.SUCCESS:
      return {
        ...state,
        saveProfileState: 'complete',
        saveState: mergeSaveStates(['complete', state.savePreferencesState]),
        error: null,
      };
    case SAVE_PROFILE.FAILURE:
      return {
        ...state,
        saveProfileState: 'error',
        saveState: mergeSaveStates(['error', state.savePreferencesState]),
        error: action.payload.error,
      };
    case SAVE_PROFILE.RESET:
      return {
        ...state,
        saveProfileState: null,
        saveState: mergeSaveStates([null, state.savePreferencesState]),
        error: null,
      };

    case SAVE_PROFILE_PHOTO.BEGIN:
      return {
        ...state,
        savePhotoState: 'pending',
        error: null,
      };
    case SAVE_PROFILE_PHOTO.SUCCESS:
      return {
        ...state,
        savePhotoState: 'complete',
        error: null,
      };
    case SAVE_PROFILE_PHOTO.FAILURE:
      return {
        ...state,
        savePhotoState: 'error',
        error: action.payload.error,
      };
    case SAVE_PROFILE_PHOTO.RESET:
      return {
        ...state,
        savePhotoState: null,
        error: null,
      };

    case DELETE_PROFILE_PHOTO.BEGIN:
      return {
        ...state,
        savePhotoState: 'pending',
        error: null,
      };
    case DELETE_PROFILE_PHOTO.SUCCESS:
      return {
        ...state,
        savePhotoState: 'complete',
        error: null,
      };
    case DELETE_PROFILE_PHOTO.FAILURE:
      return {
        ...state,
        savePhotoState: 'error',
        error: action.payload.error,
      };
    case DELETE_PROFILE_PHOTO.RESET:
      return {
        ...state,
        savePhotoState: null,
        error: null,
      };

    default:
      return state;
  }
};

export default profilePage;
