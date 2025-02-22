import {
  SAVE_PROFILE,
  SAVE_PROFILE_PHOTO,
  DELETE_PROFILE_PHOTO,
  CLOSE_FORM,
  OPEN_FORM,
  FETCH_PROFILE,
  UPDATE_DRAFT,
  RESET_DRAFTS,
} from './actions';

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
  isLoadingProfile: true,
  isAuthenticatedUserProfile: false,
};

const profilePage = (state = initialState, action = {}) => {
  switch (action.type) {
    case FETCH_PROFILE.BEGIN:
      return {
        ...state,
        // TODO: uncomment this line after ARCH-438 Image Post API returns the url
        // is complete. Right now we refetch the whole profile causing us to show a full reload
        // instead of a partial one.
        // isLoadingProfile: true,
      };
    case FETCH_PROFILE.SUCCESS:
      return {
        ...state,
        account: action.account,
        preferences: action.preferences,
        courseCertificates: action.courseCertificates,
        isLoadingProfile: false,
        isAuthenticatedUserProfile: action.isAuthenticatedUserProfile,
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
        preferences: { ...state.preferences, ...action.payload.preferences },
      };
    case SAVE_PROFILE.FAILURE:
      return {
        ...state,
        saveState: 'error',
        isLoadingProfile: false,
        errors: { ...state.errors, ...action.payload.errors },
      };
    case SAVE_PROFILE.RESET:
      return {
        ...state,
        saveState: null,
        isLoadingProfile: false,
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
        // Merge in new profile image data
        account: { ...state.account, profileImage: action.payload.profileImage },
        savePhotoState: 'complete',
        errors: {},
      };
    case SAVE_PROFILE_PHOTO.FAILURE:
      return {
        ...state,
        savePhotoState: 'error',
        errors: { ...state.errors, photo: action.payload.error },
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
        // Merge in new profile image data (should be empty or default image)
        account: { ...state.account, profileImage: action.payload.profileImage },
        savePhotoState: 'complete',
        errors: {},
      };
    case DELETE_PROFILE_PHOTO.FAILURE:
      return {
        ...state,
        savePhotoState: 'error',
        errors: { ...state.errors, ...action.payload.errors },
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
        drafts: { ...state.drafts, [action.payload.name]: action.payload.value },
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
