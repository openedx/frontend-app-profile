import profilePage, { initialState } from './reducers';
import {
  SAVE_PROFILE_PHOTO,
  DELETE_PROFILE_PHOTO,
  FETCH_PROFILE,
} from './actions';

describe('profilePage reducer', () => {
  it('should return the initial state by default', () => {
    expect(profilePage(undefined, {})).toEqual(initialState);
  });

  describe('FETCH_PROFILE actions', () => {
    it('should handle FETCH_PROFILE.BEGIN', () => {
      const action = { type: FETCH_PROFILE.BEGIN };
      const expectedState = {
        ...initialState,
        // Uncomment isLoadingProfile: true if this functionality is required.
      };
      expect(profilePage(initialState, action)).toEqual(expectedState);
    });

    it('should handle FETCH_PROFILE.SUCCESS', () => {
      const action = {
        type: FETCH_PROFILE.SUCCESS,
        account: { name: 'John Doe' },
        preferences: { theme: 'dark' },
        courseCertificates: ['cert1', 'cert2'],
        isAuthenticatedUserProfile: true,
      };
      const expectedState = {
        ...initialState,
        account: action.account,
        preferences: action.preferences,
        courseCertificates: action.courseCertificates,
        isLoadingProfile: false,
        isAuthenticatedUserProfile: action.isAuthenticatedUserProfile,
      };
      expect(profilePage(initialState, action)).toEqual(expectedState);
    });
  });

  describe('SAVE_PROFILE_PHOTO actions', () => {
    it('should handle SAVE_PROFILE_PHOTO.BEGIN', () => {
      const action = { type: SAVE_PROFILE_PHOTO.BEGIN };
      const expectedState = {
        ...initialState,
        savePhotoState: 'pending',
        errors: {},
      };
      expect(profilePage(initialState, action)).toEqual(expectedState);
    });

    it('should handle SAVE_PROFILE_PHOTO.SUCCESS', () => {
      const action = {
        type: SAVE_PROFILE_PHOTO.SUCCESS,
        payload: { profileImage: 'new-image-url.jpg' },
      };
      const expectedState = {
        ...initialState,
        account: { ...initialState.account, profileImage: action.payload.profileImage },
        savePhotoState: 'complete',
        errors: {},
      };
      expect(profilePage(initialState, action)).toEqual(expectedState);
    });

    it('should handle SAVE_PROFILE_PHOTO.FAILURE', () => {
      const action = {
        type: SAVE_PROFILE_PHOTO.FAILURE,
        payload: { error: 'Photo upload failed' },
      };
      const expectedState = {
        ...initialState,
        savePhotoState: 'error',
        errors: { photo: action.payload.error },
      };
      expect(profilePage(initialState, action)).toEqual(expectedState);
    });

    it('should handle SAVE_PROFILE_PHOTO.RESET', () => {
      const action = { type: SAVE_PROFILE_PHOTO.RESET };
      const expectedState = {
        ...initialState,
        savePhotoState: null,
        errors: {},
      };
      expect(profilePage(initialState, action)).toEqual(expectedState);
    });
  });

  describe('DELETE_PROFILE_PHOTO actions', () => {
    it('should handle DELETE_PROFILE_PHOTO.BEGIN', () => {
      const action = { type: DELETE_PROFILE_PHOTO.BEGIN };
      const expectedState = {
        ...initialState,
        savePhotoState: 'pending',
        errors: {},
      };
      expect(profilePage(initialState, action)).toEqual(expectedState);
    });

    it('should handle DELETE_PROFILE_PHOTO.SUCCESS', () => {
      const action = {
        type: DELETE_PROFILE_PHOTO.SUCCESS,
        payload: { profileImage: 'default-image-url.jpg' },
      };
      const expectedState = {
        ...initialState,
        account: { ...initialState.account, profileImage: action.payload.profileImage },
        savePhotoState: 'complete',
        errors: {},
      };
      expect(profilePage(initialState, action)).toEqual(expectedState);
    });

    it('should handle DELETE_PROFILE_PHOTO.FAILURE', () => {
      const action = {
        type: DELETE_PROFILE_PHOTO.FAILURE,
        payload: { errors: { delete: 'Failed to delete photo' } },
      };
      const expectedState = {
        ...initialState,
        savePhotoState: 'error',
        errors: { ...initialState.errors, delete: action.payload.errors.delete },
      };
      expect(profilePage(initialState, action)).toEqual(expectedState);
    });

    it('should handle DELETE_PROFILE_PHOTO.RESET', () => {
      const action = { type: DELETE_PROFILE_PHOTO.RESET };
      const expectedState = {
        ...initialState,
        savePhotoState: null,
        errors: {},
      };
      expect(profilePage(initialState, action)).toEqual(expectedState);
    });
  });
});
