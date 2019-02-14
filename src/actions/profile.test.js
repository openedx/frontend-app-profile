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
