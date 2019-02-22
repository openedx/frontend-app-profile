import defaultsDeep from 'lodash.defaultsdeep';

import {
  SAVE_PROFILE,
  SAVE_PROFILE_PHOTO,
  DELETE_PROFILE_PHOTO,
  FIELD_CLOSE,
  FIELD_OPEN,
  FETCH_PROFILE,
} from '../../actions/profile';

const initialState = {
  error: null,
  saveState: null,
  savePhotoState: null,
  currentlyEditingField: null,
  profile: {},
  preferences: {},
};

const profilePage = (state = initialState, action) => {
  switch (action.type) {
    case FIELD_OPEN:
      return {
        ...state,
        currentlyEditingField: action.fieldName,
      };
    case FIELD_CLOSE:
      // Only close if the field to close is undefined or matches the field that is currently open
      if (action.fieldName === state.currentlyEditingField) {
        return {
          ...state,
          currentlyEditingField: null,
        };
      }
      return state;

    // case FETCH_PREFERENCES.SUCCESS:
    //   return {
    //     ...state,
    //     preferences: defaultsDeep({}, action.preferences, state.preferences),
    //   };

    // case SAVE_PREFERENCES.BEGIN:
    //   return {
    //     ...state,
    //     savePreferencesState: 'pending',
    //     saveState: mergeSaveStates(['pending', state.saveProfileState]),
    //   };
    // case SAVE_PREFERENCES.SUCCESS:
    //   // defaults deep used because our preferences/state object is multi-dimensional
    //   return {
    //     ...state,
    //     savePreferencesState: 'complete',
    //     saveState: mergeSaveStates(['complete', state.saveProfileState]),
    //   };
    // case SAVE_PREFERENCES.FAILURE:
    //   return {
    //     ...state,
    //     savePreferencesState: 'error',
    //     saveState: mergeSaveStates(['error', state.saveProfileState]),
    //   };
    // case SAVE_PREFERENCES.RESET:
    //   return {
    //     ...state,
    //     savePreferencesState: null,
    //     saveState: mergeSaveStates([null, state.saveProfileState]),
    //     error: null,
    //   };

    case FETCH_PROFILE.SUCCESS:
      return {
        ...state,
        profile: action.payload.profile,
        preferences: action.payload.preferences,
      };

    case SAVE_PROFILE.BEGIN:
      return {
        ...state,
        saveState: 'pending',
        error: null,
      };
    case SAVE_PROFILE.SUCCESS:
      return {
        ...state,
        saveState: 'complete',
        error: null,
      };
    case SAVE_PROFILE.FAILURE:
      return {
        ...state,
        saveState: 'error',
        error: action.payload.error,
      };
    case SAVE_PROFILE.RESET:
      return {
        ...state,
        saveState: null,
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
