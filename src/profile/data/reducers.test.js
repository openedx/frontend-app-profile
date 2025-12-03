import profilePage, { initialState } from './reducers';
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

describe('profilePage reducer', () => {
  it('should return the initial state by default', () => {
    expect(profilePage(undefined, {})).toEqual(initialState);
  });

  describe('FETCH_PROFILE actions', () => {
    it('should handle FETCH_PROFILE.BEGIN', () => {
      const action = { type: FETCH_PROFILE.BEGIN };
      const expectedState = {
        ...initialState,
      };
      expect(profilePage(initialState, action)).toEqual(expectedState);
    });

    it('should handle FETCH_PROFILE.SUCCESS', () => {
      const action = {
        type: FETCH_PROFILE.SUCCESS,
        account: {
          name: 'John Doe',
          bio: 'Software Engineer',
          country: 'US',
          levelOfEducation: 'bachelors',
          socialLinks: [{ platform: 'x', link: 'x.com/johndoe' }],
          languageProficiencies: [{ code: 'en', name: 'English' }],
          profileImage: { url: 'profile.jpg' },
          yearOfBirth: 1990,
        },
        preferences: {
          visibilityName: 'public',
          visibilityBio: 'public',
          visibilityCountry: 'public',
          visibilityLevelOfEducation: 'public',
          visibilitySocialLinks: 'public',
          visibilityLanguageProficiencies: 'public',
        },
        courseCertificates: ['cert1', 'cert2'],
        isAuthenticatedUserProfile: true,
        countriesCodesList: ['US', 'CA'],
      };
      const expectedState = {
        ...initialState,
        account: {
          ...initialState.account,
          ...action.account,
          socialLinks: action.account.socialLinks,
          languageProficiencies: action.account.languageProficiencies,
        },
        preferences: action.preferences,
        courseCertificates: action.courseCertificates,
        isLoadingProfile: false,
        isAuthenticatedUserProfile: action.isAuthenticatedUserProfile,
        countriesCodesList: action.countriesCodesList,
      };
      expect(profilePage(initialState, action)).toEqual(expectedState);
    });
  });

  describe('SAVE_PROFILE actions', () => {
    it('should handle SAVE_PROFILE.BEGIN', () => {
      const action = { type: SAVE_PROFILE.BEGIN };
      const expectedState = {
        ...initialState,
        saveState: 'pending',
        errors: {},
      };
      expect(profilePage(initialState, action)).toEqual(expectedState);
    });

    it('should handle SAVE_PROFILE.SUCCESS', () => {
      const action = {
        type: SAVE_PROFILE.SUCCESS,
        payload: {
          account: {
            name: 'Jane Doe',
            bio: 'Updated bio',
            socialLinks: [{ platform: 'linkedin', link: 'linkedin.com/janedoe' }],
            languageProficiencies: [{ code: 'es', name: 'Spanish' }],
          },
          preferences: {
            visibilityName: 'private',
            visibilityBio: 'private',
          },
        },
      };
      const expectedState = {
        ...initialState,
        saveState: 'complete',
        errors: {},
        account: {
          ...initialState.account,
          ...action.payload.account,
          socialLinks: action.payload.account.socialLinks,
          languageProficiencies: action.payload.account.languageProficiencies,
        },
        preferences: {
          ...initialState.preferences,
          ...action.payload.preferences,
        },
      };
      expect(profilePage(initialState, action)).toEqual(expectedState);
    });

    it('should handle SAVE_PROFILE.FAILURE', () => {
      const action = {
        type: SAVE_PROFILE.FAILURE,
        payload: { errors: { save: 'Failed to save profile' } },
      };
      const expectedState = {
        ...initialState,
        saveState: 'error',
        isLoadingProfile: false,
        errors: { save: action.payload.errors.save },
      };
      expect(profilePage(initialState, action)).toEqual(expectedState);
    });

    it('should handle SAVE_PROFILE.RESET', () => {
      const action = { type: SAVE_PROFILE.RESET };
      const expectedState = {
        ...initialState,
        saveState: null,
        isLoadingProfile: false,
        errors: {},
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
        payload: { profileImage: { url: 'new-image-url.jpg' } },
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
        payload: { profileImage: { url: 'default-image-url.jpg' } },
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
        errors: { delete: action.payload.errors.delete },
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

  describe('Draft and Form actions', () => {
    it('should handle UPDATE_DRAFT', () => {
      const action = {
        type: UPDATE_DRAFT,
        payload: { name: 'bio', value: 'New bio draft' },
      };
      const expectedState = {
        ...initialState,
        drafts: { bio: 'New bio draft' },
      };
      expect(profilePage(initialState, action)).toEqual(expectedState);
    });

    it('should handle RESET_DRAFTS', () => {
      const initialStateWithDrafts = {
        ...initialState,
        drafts: { bio: 'New bio draft', name: 'New name' },
      };
      const action = { type: RESET_DRAFTS };
      const expectedState = {
        ...initialStateWithDrafts,
        drafts: {},
      };
      expect(profilePage(initialStateWithDrafts, action)).toEqual(expectedState);
    });

    it('should handle OPEN_FORM', () => {
      const action = {
        type: OPEN_FORM,
        payload: { formId: 'bioForm' },
      };
      const expectedState = {
        ...initialState,
        currentlyEditingField: 'bioForm',
        drafts: {},
      };
      expect(profilePage(initialState, action)).toEqual(expectedState);
    });

    it('should handle CLOSE_FORM when formId matches currentlyEditingField', () => {
      const initialStateWithForm = {
        ...initialState,
        currentlyEditingField: 'bioForm',
        drafts: { bio: 'New bio draft' },
      };
      const action = {
        type: CLOSE_FORM,
        payload: { formId: 'bioForm' },
      };
      const expectedState = {
        ...initialStateWithForm,
        currentlyEditingField: null,
        drafts: {},
      };
      expect(profilePage(initialStateWithForm, action)).toEqual(expectedState);
    });

    it('should not handle CLOSE_FORM when formId does not match currentlyEditingField', () => {
      const initialStateWithForm = {
        ...initialState,
        currentlyEditingField: 'bioForm',
        drafts: { bio: 'New bio draft' },
      };
      const action = {
        type: CLOSE_FORM,
        payload: { formId: 'nameForm' },
      };
      expect(profilePage(initialStateWithForm, action)).toEqual(initialStateWithForm);
    });
  });
});
