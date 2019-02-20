import {
  SAVE_PROFILE,
  SAVE_PROFILE_PHOTO,
  DELETE_PROFILE_PHOTO,
  EDITABLE_FIELD_CLOSE,
  EDITABLE_FIELD_OPEN,
  FETCH_PROFILE,
  FETCH_PREFERENCES,
  SAVE_PREFERENCES,
} from '../../actions/profile';

const initialState = {
  error: null,
  saveState: null,
  savePhotoState: null,
  currentlyEditingField: null,
  profile: {},
  fetchPreferencesState: null,
  savePreferencesState: null,
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

    case FETCH_PROFILE.SUCCESS:
      return {
        profile: action.payload.profile,
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

    case FETCH_PREFERENCES.BEGIN:
      return {
        ...state,
        fetchPreferencesState: 'pending',
      };
    case FETCH_PREFERENCES.SUCCESS:
      return {
        ...state,
        fetchPreferencesState: 'complete',
        preferences: action.preferences,
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
      return {
        ...state,
        savePreferencesState: 'complete',
        preferences: action.preferences,
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

export default profilePage;
