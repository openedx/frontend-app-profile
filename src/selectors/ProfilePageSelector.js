import { createSelector } from 'reselect';

export const formIdSelector = (state, props) => props.formId;
export const authenticationUsernameSelector = state => state.authentication.username;
export const profileAccountSelector = state => state.profilePage.account;
export const profileDraftsSelector = state => state.profilePage.drafts;
export const accountPrivacySelector = state => state.profilePage.preferences.accountPrivacy;
export const profilePreferencesSelector = state => state.profilePage.preferences;
export const profileCourseCertificatesSelector = state => state.profilePage.courseCertificates;
export const profileAccountDraftsSelector = state => state.profilePage.accountDrafts;
export const profileVisibilityDraftsSelector = state => state.profilePage.visibilityDrafts;
export const saveStateSelector = state => state.profilePage.saveState;
export const savePhotoStateSelector = state => state.profilePage.savePhotoState;
export const isLoadingProfileSelector = state => state.profilePage.isLoadingProfile;
export const currentlyEditingFieldSelector = state => state.profilePage.currentlyEditingField;
export const accountErrorsSelector = state => state.profilePage.errors;

export const isCurrentUserProfileSelector = createSelector(
  authenticationUsernameSelector,
  profileAccountSelector,
  (username, profileAccount) => username === profileAccount.username,
);

export const editableFormModeSelector = createSelector(
  profileAccountSelector,
  profileCourseCertificatesSelector,
  formIdSelector,
  isCurrentUserProfileSelector,
  currentlyEditingFieldSelector,
  (account, certificates, formId, isCurrentUserProfile, currentlyEditingField) => {
    // If the prop doesn't exist, that means it hasn't been set (for the current user's profile)
    // or is being hidden from us (for other users' profiles)
    let propExists = account[formId] != null && account[formId].length > 0;
    propExists = formId === 'certificates' ? certificates.length > 0 : propExists; // overwrite for certificates
    // If this isn't the current user's profile or if
    // the current user has no age set / under 13 ...
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
  profileDraftsSelector,
  (formId, drafts) => drafts[formId],
);

export const visibilityDraftsFieldSelector = createSelector(
  formIdSelector,
  profileVisibilityDraftsSelector,
  (formId, visibilityDrafts) => visibilityDrafts[formId],
);

// Note: Error messages are delivered from the server
// localized according to a user's account settings
export const formErrorSelector = createSelector(
  accountErrorsSelector,
  formIdSelector,
  (errors, formId) => (errors[formId] ? errors[formId].userMessage : null),
);

export const editableFormSelector = createSelector(
  editableFormModeSelector,
  formErrorSelector,
  saveStateSelector,
  (editMode, error, saveState) => ({
    editMode,
    error,
    saveState,
  }),
);

export const certificatesSelector = createSelector(
  editableFormSelector,
  profileCourseCertificatesSelector,
  (editableForm, certificates) => ({
    ...editableForm,
    certificates,
    value: certificates,
  }),
);

export const profileImageSelector = createSelector(
  profileAccountSelector,
  account => (account.profileImage != null ? {
    src: account.profileImage.imageUrlFull,
    isDefault: !account.profileImage.hasImage,
  } : {}),
);

/**
 * This is used by a saga to pull out data to process.
 */
export const handleSaveProfileSelector = createSelector(
  authenticationUsernameSelector,
  profileDraftsSelector,
  profilePreferencesSelector,
  (username, drafts, preferences) => ({
    username,
    drafts,
    preferences,
  }),
);

// Reformats the social links in a platform-keyed hash.
const socialLinksByPlatformSelector = createSelector(
  profileAccountSelector,
  (account) => {
    const linksByPlatform = {};
    if (account.socialLinks !== undefined) {
      account.socialLinks.forEach((socialLink) => {
        linksByPlatform[socialLink.platform] = socialLink;
      });
    }
    return linksByPlatform;
  },
);

const draftSocialLinksByPlatformSelector = createSelector(
  profileDraftsSelector,
  (drafts) => {
    const linksByPlatform = {};
    if (drafts.socialLinks !== undefined) {
      drafts.socialLinks.forEach((socialLink) => {
        linksByPlatform[socialLink.platform] = socialLink;
      });
    }
    return linksByPlatform;
  },
);

// Fleshes out our list of existing social links with all the other ones the user can set.
export const formSocialLinksSelector = createSelector(
  socialLinksByPlatformSelector,
  draftSocialLinksByPlatformSelector,
  (linksByPlatform, draftLinksByPlatform) => {
    const knownPlatforms = ['twitter', 'facebook', 'linkedin'];
    const socialLinks = [];
    // For each known platform
    knownPlatforms.forEach((platform) => {
      // If the link is in our drafts.
      if (draftLinksByPlatform[platform] !== undefined) {
        // Use the draft one.
        socialLinks.push(draftLinksByPlatform[platform]);
      } else if (linksByPlatform[platform] !== undefined) {
        // Otherwise use the real one.
        socialLinks.push(linksByPlatform[platform]);
      } else {
        // And if it's not in either, use a stub.
        socialLinks.push({
          platform,
          socialLink: null,
        });
      }
    });
    return socialLinks;
  },
);

export const visibilitiesSelector = createSelector(
  profilePreferencesSelector,
  accountPrivacySelector,
  (preferences, accountPrivacy) => {
    switch (accountPrivacy) {
      case 'custom':
        return {
          visibilityBio: preferences.visibilityBio || 'private',
          visibilityCourseCertificates: preferences.visibilityCourseCertificates || 'private',
          visibilityCountry: preferences.visibilityCountry || 'private',
          visibilityEducation: preferences.visibilityEducation || 'private',
          visibilityLanguageProficiencies: preferences.visibilityLanguageProficiencies || 'private',
          visibilityName: preferences.visibilityName || 'private',
          visibilitySocialLinks: preferences.visibilitySocialLinks || 'private',
        };
      case 'private':
        return {
          visibilityBio: 'private',
          visibilityCourseCertificates: 'private',
          visibilityCountry: 'private',
          visibilityEducation: 'private',
          visibilityLanguageProficiencies: 'private',
          visibilityName: 'private',
          visibilitySocialLinks: 'private',
        };
      case 'all_users':
      default:
        // All users is intended to fall through to default.
        // If there is no value for accountPrivacy in perferences, that means it has not been
        // explicitly set yet. The server assumes - today - that this means "all_users",
        // so we emulate that here in the client.
        return {
          visibilityBio: 'all_users',
          visibilityCourseCertificates: 'all_users',
          visibilityCountry: 'all_users',
          visibilityEducation: 'all_users',
          visibilityLanguageProficiencies: 'all_users',
          visibilityName: 'all_users',
          visibilitySocialLinks: 'all_users',
        };
    }
  },
);

/**
 * If there's no draft present at all (undefined), use the original committed value.
 */
function chooseFormValue(draft, committed) {
  return draft !== undefined ? draft : committed;
}

export const formValuesSelector = createSelector(
  profileAccountSelector,
  visibilitiesSelector,
  profileDraftsSelector,
  profileCourseCertificatesSelector,
  formSocialLinksSelector,
  (account, visibilities, drafts, courseCertificates, socialLinks) => ({
    bio: chooseFormValue(drafts.bio, account.bio),
    visibilityBio: chooseFormValue(drafts.visibilityBio, visibilities.visibilityBio),
    courseCertificates,
    visibilityCourseCertificates: chooseFormValue(
      drafts.visibilityCourseCertificates,
      visibilities.visibilityCourseCertificates,
    ),
    country: chooseFormValue(drafts.country, account.country),
    visibilityCountry: chooseFormValue(drafts.visibilityCountry, visibilities.visibilityCountry),
    education: chooseFormValue(drafts.education, account.education),
    visibilityEducation: chooseFormValue(
      drafts.visibilityEducation,
      visibilities.visibilityEducation,
    ),
    languageProficiencies: chooseFormValue(
      drafts.languageProficiencies,
      account.languageProficiencies,
    ),
    visibilityLanguageProficiencies: chooseFormValue(
      drafts.visibilityLanguageProficiencies,
      visibilities.visibilityLanguageProficiencies,
    ),
    name: chooseFormValue(drafts.name, account.name),
    visibilityName: chooseFormValue(drafts.visibilityName, visibilities.visibilityName),
    socialLinks, // Social links is calculated in its own selector, since it's complicated.
    visibilitySocialLinks: chooseFormValue(
      drafts.visibilitySocialLinks,
      visibilities.visibilitySocialLinks,
    ),
  }),
);

export const profilePageSelector = createSelector(
  profileAccountSelector,
  formValuesSelector,
  profileImageSelector,
  saveStateSelector,
  savePhotoStateSelector,
  isLoadingProfileSelector,
  isCurrentUserProfileSelector,
  draftSocialLinksByPlatformSelector,
  accountErrorsSelector,
  (
    account,
    formValues,
    profileImage,
    saveState,
    savePhotoState,
    isLoadingProfile,
    isCurrentUserProfile,
    draftSocialLinksByPlatform,
    errors,
  ) => ({
    // Account data we need
    username: account.username,
    profileImage,
    requiresParentalConsent: account.requiresParentalConsent,
    dateJoined: account.dateJoined,

    // Bio form data
    bio: formValues.bio,
    visibilityBio: formValues.visibilityBio,

    // Certificates form data
    courseCertificates: formValues.courseCertificates,
    visibilityCourseCertificates: formValues.visibilityCourseCertificates,

    // Country form data
    country: formValues.country,
    visibilityCountry: formValues.visibilityCountry,

    // Education form data
    education: formValues.education,
    visibilityEducation: formValues.visibilityEducation,

    // Language proficiency form data
    languageProficiencies: formValues.languageProficiencies,
    visibilityLanguageProficiencies: formValues.visibilityLanguageProficiencies,

    // Name form data
    name: formValues.name,
    visibilityName: formValues.visibilityName,

    // Social links form data
    socialLinks: formValues.socialLinks,
    visibilitySocialLinks: formValues.visibilitySocialLinks,
    draftSocialLinksByPlatform,

    // Other data we need
    saveState,
    savePhotoState,
    isLoadingProfile,
    isCurrentUserProfile,
    photoUploadError: errors.photo || null,
  }),
);
