import {
  openForm,
  closeForm,
  OPEN_FORM,
  CLOSE_FORM,
  SAVE_PROFILE,
  saveProfileBegin,
  saveProfileSuccess,
  saveProfileFailure,
  saveProfileReset,
  saveProfile,
  SAVE_PROFILE_PHOTO,
  saveProfilePhotoBegin,
  saveProfilePhotoSuccess,
  saveProfilePhotoFailure,
  saveProfilePhotoReset,
  saveProfilePhoto,
  DELETE_PROFILE_PHOTO,
  deleteProfilePhotoBegin,
  deleteProfilePhotoSuccess,
  deleteProfilePhotoFailure,
  deleteProfilePhotoReset,
  deleteProfilePhoto,
} from './ProfileActions';

describe('editable field actions', () => {
  it('should create an open action', () => {
    const expectedAction = {
      type: OPEN_FORM,
      payload: {
        formId: 'name',
      },
    };
    expect(openForm('name')).toEqual(expectedAction);
  });

  it('should create a closed action', () => {
    const expectedAction = {
      type: CLOSE_FORM,
      payload: {
        formId: 'name',
      },
    };
    expect(closeForm('name')).toEqual(expectedAction);
  });
});

describe('SAVE profile actions', () => {
  it('should create an action to signal the start of a profile save', () => {
    const expectedAction = {
      type: SAVE_PROFILE.BASE,
      payload: {
        formId: 'name',
      },
    };
    expect(saveProfile('name')).toEqual(expectedAction);
  });

  it('should create an action to signal user profile save success', () => {
    const accountData = { name: 'Full Name' };
    const preferencesData = { visibility: { name: 'private' } };
    const expectedAction = {
      type: SAVE_PROFILE.SUCCESS,
      payload: {
        account: accountData,
        preferences: preferencesData,
      },
    };
    expect(saveProfileSuccess(accountData, preferencesData)).toEqual(expectedAction);
  });

  it('should create an action to signal user profile save beginning', () => {
    const expectedAction = {
      type: SAVE_PROFILE.BEGIN,
    };
    expect(saveProfileBegin()).toEqual(expectedAction);
  });

  it('should create an action to signal user profile save success', () => {
    const expectedAction = {
      type: SAVE_PROFILE.RESET,
    };
    expect(saveProfileReset()).toEqual(expectedAction);
  });

  it('should create an action to signal user account save failure', () => {
    const error = 'Test failure';
    const expectedAction = {
      type: SAVE_PROFILE.FAILURE,
      payload: { error },
    };
    expect(saveProfileFailure(error)).toEqual(expectedAction);
  });
});


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
    const expectedAction = {
      type: SAVE_PROFILE_PHOTO.SUCCESS,
    };
    expect(saveProfilePhotoSuccess()).toEqual(expectedAction);
  });

  it('should create an action to signal user profile photo save success', () => {
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
    const expectedAction = {
      type: DELETE_PROFILE_PHOTO.SUCCESS,
    };
    expect(deleteProfilePhotoSuccess()).toEqual(expectedAction);
  });

  it('should create an action to signal user profile photo deletion success', () => {
    const expectedAction = {
      type: DELETE_PROFILE_PHOTO.RESET,
    };
    expect(deleteProfilePhotoReset()).toEqual(expectedAction);
  });

  it('should create an action to signal user profile photo deletion failure', () => {
    const error = 'Test failure';
    const expectedAction = {
      type: DELETE_PROFILE_PHOTO.FAILURE,
      payload: { error },
    };
    expect(deleteProfilePhotoFailure(error)).toEqual(expectedAction);
  });
});


describe('Editable field opening and closing actions', () => {
  const formId = 'name';

  it('should create an action to signal the opening a field', () => {
    const expectedAction = {
      type: OPEN_FORM,
      payload: {
        formId,
      },
    };
    expect(openForm(formId)).toEqual(expectedAction);
  });

  it('should create an action to signal the closing a field', () => {
    const expectedAction = {
      type: CLOSE_FORM,
      payload: {
        formId,
      },
    };
    expect(closeForm(formId)).toEqual(expectedAction);
  });
});
