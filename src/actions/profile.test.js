import {
  openEditableField,
  closeEditableField,
  EDITABLE_FIELD_OPEN,
  EDITABLE_FIELD_CLOSE,
  SAVE_USER_PROFILE,
  saveUserProfileBegin,
  saveUserProfileSuccess,
  saveUserProfileFailure,
  saveUserProfileReset,
  saveUserProfile,
  SAVE_USER_PROFILE_PHOTO,
  saveUserProfilePhotoBegin,
  saveUserProfilePhotoSuccess,
  saveUserProfilePhotoFailure,
  saveUserProfilePhotoReset,
  saveUserProfilePhoto,
  DELETE_USER_PROFILE_PHOTO,
  deleteUserProfilePhotoBegin,
  deleteUserProfilePhotoSuccess,
  deleteUserProfilePhotoFailure,
  deleteUserProfilePhotoReset,
  deleteUserProfilePhoto,
} from './profile';

describe('editable field actions', () => {
  it('should create an open action', () => {
    const expectedAction = {
      type: EDITABLE_FIELD_OPEN,
      fieldName: 'name',
    };
    expect(openEditableField('name')).toEqual(expectedAction);
  });

  it('should create a closed action', () => {
    const expectedAction = {
      type: EDITABLE_FIELD_CLOSE,
      fieldName: 'name',
    };
    expect(closeEditableField('name')).toEqual(expectedAction);
  });
});

describe('SAVE profile actions', () => {
  const userAccountState = {
    username: 'verified',
    email: 'verified@example.com',
    bio: 'A great bio.',
    name: 'Veri Fied',
    country: 'US',
    // Good enough for testing / and since we have no factories
  };

  it('should create an action to signal the start of a profile save', () => {
    const expectedAction = {
      type: SAVE_USER_PROFILE.BASE,
      payload: {
        username: 'user person',
        userAccountState,
        fieldName: 'fullName',
      },
    };
    expect(saveUserProfile('user person', userAccountState, 'fullName')).toEqual(expectedAction);
  });

  it('should create an action to signal user profile save success', () => {
    const expectedAction = {
      type: SAVE_USER_PROFILE.SUCCESS,
    };
    expect(saveUserProfileSuccess()).toEqual(expectedAction);
  });

  it('should create an action to signal user profile save beginning', () => {
    const expectedAction = {
      type: SAVE_USER_PROFILE.BEGIN,
    };
    expect(saveUserProfileBegin()).toEqual(expectedAction);
  });

  it('should create an action to signal user profile save success', () => {
    const expectedAction = {
      type: SAVE_USER_PROFILE.RESET,
    };
    expect(saveUserProfileReset()).toEqual(expectedAction);
  });

  it('should create an action to signal user account save failure', () => {
    const error = 'Test failure';
    const expectedAction = {
      type: SAVE_USER_PROFILE.FAILURE,
      payload: { error },
    };
    expect(saveUserProfileFailure(error)).toEqual(expectedAction);
  });
});


describe('SAVE profile photo actions', () => {
  it('should create an action to signal the start of a profile photo save', () => {
    const formData = 'multipart form data';
    const expectedAction = {
      type: SAVE_USER_PROFILE_PHOTO.BASE,
      payload: {
        username: 'myusername',
        formData,
      },
    };
    expect(saveUserProfilePhoto('myusername', formData)).toEqual(expectedAction);
  });

  it('should create an action to signal user profile photo save beginning', () => {
    const expectedAction = {
      type: SAVE_USER_PROFILE_PHOTO.BEGIN,
    };
    expect(saveUserProfilePhotoBegin()).toEqual(expectedAction);
  });

  it('should create an action to signal user profile photo save success', () => {
    const expectedAction = {
      type: SAVE_USER_PROFILE_PHOTO.SUCCESS,
    };
    expect(saveUserProfilePhotoSuccess()).toEqual(expectedAction);
  });

  it('should create an action to signal user profile photo save success', () => {
    const expectedAction = {
      type: SAVE_USER_PROFILE_PHOTO.RESET,
    };
    expect(saveUserProfilePhotoReset()).toEqual(expectedAction);
  });

  it('should create an action to signal user profile photo save failure', () => {
    const error = 'Test failure';
    const expectedAction = {
      type: SAVE_USER_PROFILE_PHOTO.FAILURE,
      payload: { error },
    };
    expect(saveUserProfilePhotoFailure(error)).toEqual(expectedAction);
  });
});


describe('DELETE profile photo actions', () => {
  it('should create an action to signal the start of a profile photo deletion', () => {
    const expectedAction = {
      type: DELETE_USER_PROFILE_PHOTO.BASE,
      payload: {
        username: 'myusername',
      },
    };
    expect(deleteUserProfilePhoto('myusername')).toEqual(expectedAction);
  });

  it('should create an action to signal user profile photo deletion beginning', () => {
    const expectedAction = {
      type: DELETE_USER_PROFILE_PHOTO.BEGIN,
    };
    expect(deleteUserProfilePhotoBegin()).toEqual(expectedAction);
  });

  it('should create an action to signal user profile photo deletion success', () => {
    const expectedAction = {
      type: DELETE_USER_PROFILE_PHOTO.SUCCESS,
    };
    expect(deleteUserProfilePhotoSuccess()).toEqual(expectedAction);
  });

  it('should create an action to signal user profile photo deletion success', () => {
    const expectedAction = {
      type: DELETE_USER_PROFILE_PHOTO.RESET,
    };
    expect(deleteUserProfilePhotoReset()).toEqual(expectedAction);
  });

  it('should create an action to signal user profile photo deletion failure', () => {
    const error = 'Test failure';
    const expectedAction = {
      type: DELETE_USER_PROFILE_PHOTO.FAILURE,
      payload: { error },
    };
    expect(deleteUserProfilePhotoFailure(error)).toEqual(expectedAction);
  });
});


describe('Editable field opening and closing actions', () => {
  const fieldName = 'fullName';

  it('should create an action to signal the opening a field', () => {
    const expectedAction = {
      type: EDITABLE_FIELD_OPEN,
      fieldName,
    };
    expect(openEditableField(fieldName)).toEqual(expectedAction);
  });

  it('should create an action to signal the closing a field', () => {
    const expectedAction = {
      type: EDITABLE_FIELD_CLOSE,
      fieldName,
    };
    expect(closeEditableField(fieldName)).toEqual(expectedAction);
  });
});
