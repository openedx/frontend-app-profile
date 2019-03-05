import {
  SAVE_PROFILE,
  SAVE_PROFILE_PHOTO,
  DELETE_PROFILE_PHOTO,
  CLOSE_FORM,
  OPEN_FORM,
  FETCH_PROFILE,
  UPDATE_DRAFT,
  RESET_DRAFTS,
} from '../actions/ProfileActions';

export const initialState = {
  errors: {},
  saveState: null,
  savePhotoState: null,
  currentlyEditingField: null,
  account: {
    socialLinks: [],
  },
  preferences: {},
  courseCertificates: [],
  drafts: {},
};

const profilePage = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PROFILE.SUCCESS:
      return {
        ...state,
        account: action.account,
        preferences: action.preferences,
        courseCertificates: action.courseCertificates,
      };
    case SAVE_PROFILE.BEGIN:
      return {
        ...state,
        saveState: 'pending',
        errors: {},
      };
    case SAVE_PROFILE.SUCCESS:
      return {
        ...state,
        saveState: 'complete',
        errors: {},
        // Account is always replaced completely.
        account: action.payload.account !== null ? action.payload.account : state.account,
        // Preferences changes get merged in.
        preferences: Object.assign({}, state.preferences, action.payload.preferences),
      };
    case SAVE_PROFILE.FAILURE:
      return {
        ...state,
        saveState: 'error',
        errors: Object.assign({}, state.errors, action.payload.errors),
      };
    case SAVE_PROFILE.RESET:
      return {
        ...state,
        saveState: null,
        errors: {},
      };

    case SAVE_PROFILE_PHOTO.BEGIN:
      return {
        ...state,
        savePhotoState: 'pending',
        errors: {},
      };
    case SAVE_PROFILE_PHOTO.SUCCESS:
      return {
        ...state,
        savePhotoState: 'complete',
        errors: {},
      };
    case SAVE_PROFILE_PHOTO.FAILURE:
      return {
        ...state,
        savePhotoState: 'error',
        errors: Object.assign({}, state.errors, { photo: action.payload.error }),
      };
    case SAVE_PROFILE_PHOTO.RESET:
      return {
        ...state,
        savePhotoState: null,
        errors: {},
      };

    case DELETE_PROFILE_PHOTO.BEGIN:
      return {
        ...state,
        savePhotoState: 'pending',
        errors: {},
      };
    case DELETE_PROFILE_PHOTO.SUCCESS:
      return {
        ...state,
        savePhotoState: 'complete',
        errors: {},
      };
    case DELETE_PROFILE_PHOTO.FAILURE:
      return {
        ...state,
        savePhotoState: 'error',
        errors: Object.assign({}, state.errors, action.payload.errors),
      };
    case DELETE_PROFILE_PHOTO.RESET:
      return {
        ...state,
        savePhotoState: null,
        errors: {},
      };

    case UPDATE_DRAFT:
      return {
        ...state,
        drafts: Object.assign({}, state.drafts, {
          [action.payload.name]: action.payload.value,
        }),
      };

    case RESET_DRAFTS:
      return {
        ...state,
        drafts: {},
      };
    case OPEN_FORM:
      return {
        ...state,
        currentlyEditingField: action.payload.formId,
        drafts: {},
      };
    case CLOSE_FORM:
      // Only close if the field to close is undefined or matches the field that is currently open
      if (action.payload.formId === state.currentlyEditingField) {
        return {
          ...state,
          currentlyEditingField: null,
          drafts: {},
        };
      }
      return state;
    default:
      return state;
  }
};

export default profilePage;
