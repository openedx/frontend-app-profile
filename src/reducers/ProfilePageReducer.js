import {
  SAVE_PROFILE,
  SAVE_PROFILE_PHOTO,
  DELETE_PROFILE_PHOTO,
  CLOSE_FORM,
  OPEN_FORM,
  FETCH_PROFILE,
  UPDATE_ACCOUNT_DRAFT,
  UPDATE_VISIBILITY_DRAFT,
  RESET_DRAFTS,
} from '../actions/ProfileActions';

const initialState = {
  errors: {},
  saveState: null,
  savePhotoState: null,
  currentlyEditingField: null,
  account: {
    socialLinks: [],
  },
  preferences: {
    visibility: {},
  },
  certificates: [],
  accountDrafts: {},
  visibilityDrafts: {},
};

const profilePage = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PROFILE.SUCCESS:
      return {
        ...state,
        account: action.account,
        preferences: action.preferences,
        certificates: action.certificates,
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
        preferences: Object.assign({}, state.preferences, {
          visibility: Object.assign(
            {},
            state.preferences.visibility,
            action.payload.preferences.visibility,
          ),
        }),
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
        errors: Object.assign({}, state.errors, action.payload.errors),
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

    case UPDATE_ACCOUNT_DRAFT:
      return {
        ...state,
        accountDrafts: Object.assign({}, state.accountDrafts, {
          [action.payload.name]: action.payload.value,
        }),
      };

    case UPDATE_VISIBILITY_DRAFT:
      return {
        ...state,
        visibilityDrafts: Object.assign({}, state.visibilityDrafts, {
          [action.payload.name]: action.payload.value,
        }),
      };

    case RESET_DRAFTS:
      return {
        ...state,
        accountDrafts: {},
        visibilityDrafts: {},
      };
    case OPEN_FORM:
      return {
        ...state,
        currentlyEditingField: action.payload.formId,
      };
    case CLOSE_FORM:
      // Only close if the field to close is undefined or matches the field that is currently open
      if (action.payload.formId === state.currentlyEditingField) {
        return {
          ...state,
          currentlyEditingField: null,
        };
      }
      return state;
    default:
      return state;
  }
};

export default profilePage;
