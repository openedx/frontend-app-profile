import {
  SAVE_USER_PROFILE,
  SAVE_USER_PROFILE_PHOTO,
  EDITABLE_FIELD_CLOSE,
  EDITABLE_FIELD_OPEN,
} from '../../actions/profile';


const initialState = {
  error: null,
  saveState: null,
  savePhotoState: null,
  currentlyEditingField: null,
};


const profile = (state = initialState, action) => {
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

    case SAVE_USER_PROFILE.BEGIN:
      return {
        ...state,
        saveState: 'pending',
        error: null,
      };
    case SAVE_USER_PROFILE.SUCCESS:
      return {
        ...state,
        saveState: 'complete',
        error: null,
      };
    case SAVE_USER_PROFILE.FAILURE:
      return {
        ...state,
        saveState: 'error',
        error: action.payload.error,
      };
    case SAVE_USER_PROFILE.RESET:
      return {
        ...state,
        saveState: null,
        error: null,
      };

    case SAVE_USER_PROFILE_PHOTO.BEGIN:
      return {
        ...state,
        savePhotoState: 'pending',
        error: null,
      };
    case SAVE_USER_PROFILE_PHOTO.SUCCESS:
      return {
        ...state,
        savePhotoState: 'complete',
        error: null,
      };
    case SAVE_USER_PROFILE_PHOTO.FAILURE:
      return {
        ...state,
        savePhotoState: 'error',
        error: action.payload.error,
      };
    case SAVE_USER_PROFILE_PHOTO.RESET:
      return {
        ...state,
        savePhotoState: null,
        error: null,
      };

    default:
      return state;
  }
};

export default profile;
