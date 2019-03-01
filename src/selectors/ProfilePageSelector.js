import { createSelector } from 'reselect';

export const formIdSelector = (state, props) => props.formId;
export const authenticationUsernameSelector = state => state.authentication.username;
export const profileAccountSelector = state => state.profilePage.account;
export const profileCertificatesSelector = state => state.profilePage.certificates;
export const profileAccountDraftsSelector = state => state.profilePage.accountDrafts;
export const profileVisibilityDraftsSelector = state => state.profilePage.visibilityDrafts;
export const profileVisibilitySelector = state => state.profilePage.preferences.visibility;
export const saveStateSelector = state => state.profilePage.saveState;
export const currentlyEditingFieldSelector = state => state.profilePage.currentlyEditingField;
export const accountErrorsSelector = state => state.profilePage.errors;

export const isCurrentUserProfileSelector = createSelector(
  authenticationUsernameSelector,
  profileAccountSelector,
  (username, profileAccount) => username === profileAccount.username,
);

export const editableFormModeSelector = createSelector(
  profileAccountSelector,
  profileCertificatesSelector,
  formIdSelector,
  isCurrentUserProfileSelector,
  currentlyEditingFieldSelector,
  (account, certificates, formId, isCurrentUserProfile, currentlyEditingField) => {
    // If the prop doesn't exist, that means it hasn't been set (for the current user's profile)
    // or is being hidden from us (for other users' profiles)
    let propExists = account[formId] != null && account[formId].length > 0;
    propExists = formId === 'certificates' ? certificates !== null : propExists; // overwrite for certificates
    // If this isn't the current user's profile...
    if (!isCurrentUserProfile || account.requiresParentalConsent) {
      // then there are only two options: static or nothing.
      // We use 'null' as a return value because the consumers of
      // getMode render nothing at all on a mode of null.
      return propExists ? 'static' : null;
    }
    // Otherwise, if this is the current user's profile...
    if (formId === currentlyEditingField) {
      return 'editing';
    }

    if (!propExists) {
      return 'empty';
    }

    return 'editable';
  },
);

export const accountDraftsFieldSelector = createSelector(
  formIdSelector,
  profileAccountDraftsSelector,
  (formId, accountDrafts) => accountDrafts[formId],
);

export const visibilityDraftsFieldSelector = createSelector(
  formIdSelector,
  profileVisibilityDraftsSelector,
  (formId, visibilityDrafts) => visibilityDrafts[formId],
);

export const formErrorSelector = createSelector(
  accountErrorsSelector,
  formIdSelector,
  (errors, formId) => errors[formId] || null,
);

export const editableFormSelector = createSelector(
  editableFormModeSelector,
  profileAccountSelector,
  profileVisibilitySelector,
  formIdSelector,
  formErrorSelector,
  saveStateSelector,
  accountDraftsFieldSelector,
  visibilityDraftsFieldSelector,
  (
    editMode,
    account,
    visibility,
    formId,
    error,
    saveState,
    accountDraftsField,
    visibilityDraftsField,
  ) => ({
    value: accountDraftsField || account[formId] || '',
    committedValue: account[formId] || '',
    visibility: visibilityDraftsField || visibility[formId] || 'private',
    editMode,
    error,
    saveState,
  }),
);

export const certificatesSelector = createSelector(
  editableFormSelector,
  profileCertificatesSelector,
  (editableForm, certificates) => ({
    ...editableForm,
    certificates,
    value: certificates,
  }),
);

/**
 * This is used by a saga to pull out data to process.
 */
export const handleSaveProfileSelector = createSelector(
  authenticationUsernameSelector,
  profileAccountDraftsSelector,
  profileVisibilityDraftsSelector,
  (username, accountDrafts, visibilityDrafts) => ({
    username,
    accountDrafts,
    visibilityDrafts,
  }),
);
