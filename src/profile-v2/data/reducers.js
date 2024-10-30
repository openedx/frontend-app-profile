import {
  SAVE_PROFILE_PHOTO,
  DELETE_PROFILE_PHOTO,
  FETCH_PROFILE,
} from './actions';

export const initialState = {
  errors: {},
  savePhotoState: null,
  account: {
    socialLinks: [],
  },
  preferences: {},
  courseCertificates: [],
  isLoadingProfile: true,
  isAuthenticatedUserProfile: false,
  disabledCountries: ['RU'],
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

    default:
      return state;
  }
};

export default profilePage;
