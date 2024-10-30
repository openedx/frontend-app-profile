import {
  SAVE_PROFILE_PHOTO,
  saveProfilePhotoBegin,
  saveProfilePhotoSuccess,
  saveProfilePhotoFailure,
  saveProfilePhotoReset,
  saveProfilePhoto,
  DELETE_PROFILE_PHOTO,
  deleteProfilePhotoBegin,
  deleteProfilePhotoSuccess,
  deleteProfilePhotoReset,
  deleteProfilePhoto,
} from './actions';

describe('SAVE profile photo actions', () => {
  it('should create an action to signal the start of a profile photo save', () => {
    const formData = 'multipart form data';
    const expectedAction = {
      type: SAVE_PROFILE_PHOTO.BASE,
      payload: {
        username: 'myusername',
        formData,
      },
    };
    expect(saveProfilePhoto('myusername', formData)).toEqual(expectedAction);
  });

  it('should create an action to signal user profile photo save beginning', () => {
    const expectedAction = {
      type: SAVE_PROFILE_PHOTO.BEGIN,
    };
    expect(saveProfilePhotoBegin()).toEqual(expectedAction);
  });

  it('should create an action to signal user profile photo save success', () => {
    const newPhotoData = { hasImage: true };
    const expectedAction = {
      type: SAVE_PROFILE_PHOTO.SUCCESS,
      payload: {
        profileImage: newPhotoData,
      },
    };
    expect(saveProfilePhotoSuccess(newPhotoData)).toEqual(expectedAction);
  });

  it('should create an action to signal user profile photo save reset', () => {
    const expectedAction = {
      type: SAVE_PROFILE_PHOTO.RESET,
    };
    expect(saveProfilePhotoReset()).toEqual(expectedAction);
  });

  it('should create an action to signal user profile photo save failure', () => {
    const error = 'Test failure';
    const expectedAction = {
      type: SAVE_PROFILE_PHOTO.FAILURE,
      payload: { error },
    };
    expect(saveProfilePhotoFailure(error)).toEqual(expectedAction);
  });
});

describe('DELETE profile photo actions', () => {
  it('should create an action to signal the start of a profile photo deletion', () => {
    const expectedAction = {
      type: DELETE_PROFILE_PHOTO.BASE,
      payload: {
        username: 'myusername',
      },
    };
    expect(deleteProfilePhoto('myusername')).toEqual(expectedAction);
  });

  it('should create an action to signal user profile photo deletion beginning', () => {
    const expectedAction = {
      type: DELETE_PROFILE_PHOTO.BEGIN,
    };
    expect(deleteProfilePhotoBegin()).toEqual(expectedAction);
  });

  it('should create an action to signal user profile photo deletion success', () => {
    const defaultPhotoData = { hasImage: false };
    const expectedAction = {
      type: DELETE_PROFILE_PHOTO.SUCCESS,
      payload: {
        profileImage: defaultPhotoData,
      },
    };
    expect(deleteProfilePhotoSuccess(defaultPhotoData)).toEqual(expectedAction);
  });

  it('should create an action to signal user profile photo deletion reset', () => {
    const expectedAction = {
      type: DELETE_PROFILE_PHOTO.RESET,
    };
    expect(deleteProfilePhotoReset()).toEqual(expectedAction);
  });
});
