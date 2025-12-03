import { createSelector } from 'reselect';
import {
  getLocale,
  getLanguageList,
  getCountryList,
  getCountryMessages,
  getLanguageMessages,
} from '@edx/frontend-platform/i18n';

export const formIdSelector = (state, props) => props.formId;
export const userAccountSelector = state => state.userAccount;
export const profileAccountSelector = state => state.profilePage.account;
export const profileDraftsSelector = state => state.profilePage.drafts;
export const accountPrivacySelector = state => state.profilePage.preferences.accountPrivacy;
export const profilePreferencesSelector = state => state.profilePage.preferences;
export const profileCourseCertificatesSelector = state => state.profilePage.courseCertificates;
export const saveStateSelector = state => state.profilePage.saveState;
export const savePhotoStateSelector = state => state.profilePage.savePhotoState;
export const isLoadingProfileSelector = state => state.profilePage.isLoadingProfile;
export const currentlyEditingFieldSelector = state => state.profilePage.currentlyEditingField;
export const accountErrorsSelector = state => state.profilePage.errors;
export const isAuthenticatedUserProfileSelector = state => state.profilePage.isAuthenticatedUserProfile;
export const countriesCodesListSelector = state => state.profilePage.countriesCodesList;

export const editableFormModeSelector = createSelector(
  profileAccountSelector,
  isAuthenticatedUserProfileSelector,
  profileCourseCertificatesSelector,
  formIdSelector,
  currentlyEditingFieldSelector,
  (account, isAuthenticatedUserProfile, certificates, formId, currentlyEditingField) => {
    let propExists = account[formId] != null && account[formId].length > 0;
    propExists = formId === 'certificates' ? certificates.length > 0 : propExists;
    if (!isAuthenticatedUserProfile) {
      return 'static';
    }
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
  profileDraftsSelector,
  (formId, drafts) => drafts[`visibility${formId.charAt(0).toUpperCase() + formId.slice(1)}`],
);

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

export const localeSelector = () => getLocale();
export const countryMessagesSelector = createSelector(
  localeSelector,
  locale => getCountryMessages(locale),
);
export const languageMessagesSelector = createSelector(
  localeSelector,
  locale => getLanguageMessages(locale),
);

export const sortedLanguagesSelector = createSelector(
  localeSelector,
  locale => getLanguageList(locale),
);

export const sortedCountriesSelector = createSelector(
  localeSelector,
  countriesCodesListSelector,
  profileAccountSelector,
  (locale, countriesCodesList, profileAccount) => {
    const countryList = getCountryList(locale);
    const userCountry = profileAccount.country;

    return countryList.filter(({ code }) => code === userCountry || countriesCodesList.find(x => x === code));
  },
);

export const preferredLanguageSelector = createSelector(
  editableFormSelector,
  sortedLanguagesSelector,
  languageMessagesSelector,
  (editableForm, sortedLanguages, languageMessages) => ({
    ...editableForm,
    sortedLanguages,
    languageMessages,
  }),
);

export const countrySelector = createSelector(
  editableFormSelector,
  sortedCountriesSelector,
  countryMessagesSelector,
  countriesCodesListSelector,
  profileAccountSelector,
  (editableForm, translatedCountries, countryMessages, countriesCodesList, account) => ({
    ...editableForm,
    translatedCountries,
    countryMessages,
    countriesCodesList,
    committedCountry: account.country,
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
  account => (account.profileImage != null
    ? {
      src: account.profileImage.imageUrlFull,
      isDefault: !account.profileImage.hasImage,
    }
    : {}),
);

export const handleSaveProfileSelector = createSelector(
  profileDraftsSelector,
  profilePreferencesSelector,
  (drafts, preferences) => ({
    drafts,
    preferences,
  }),
);

const socialLinksByPlatformSelector = createSelector(
  profileAccountSelector,
  (account) => {
    const linksByPlatform = {};
    if (Array.isArray(account.socialLinks)) {
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
    if (Array.isArray(drafts.socialLinks)) {
      drafts.socialLinks.forEach((socialLink) => {
        linksByPlatform[socialLink.platform] = socialLink;
      });
    }
    return linksByPlatform;
  },
);

export const formSocialLinksSelector = createSelector(
  socialLinksByPlatformSelector,
  draftSocialLinksByPlatformSelector,
  (linksByPlatform, draftLinksByPlatform) => {
    const knownPlatforms = ['x', 'facebook', 'linkedin'];
    const socialLinks = [];
    knownPlatforms.forEach((platform) => {
      if (draftLinksByPlatform[platform] !== undefined) {
        socialLinks.push(draftLinksByPlatform[platform]);
      } else if (linksByPlatform[platform] !== undefined) {
        socialLinks.push(linksByPlatform[platform]);
      } else {
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
          visibilityBio: preferences.visibilityBio || 'all_users',
          visibilityCountry: preferences.visibilityCountry || 'all_users',
          visibilityLevelOfEducation: preferences.visibilityLevelOfEducation || 'all_users',
          visibilityLanguageProficiencies: preferences.visibilityLanguageProficiencies || 'all_users',
          visibilityName: preferences.visibilityName || 'all_users',
          visibilitySocialLinks: preferences.visibilitySocialLinks || 'all_users',
        };
      case 'private':
        return {
          visibilityBio: 'private',
          visibilityCountry: 'private',
          visibilityLevelOfEducation: 'private',
          visibilityLanguageProficiencies: 'private',
          visibilityName: 'private',
          visibilitySocialLinks: 'private',
        };
      case 'all_users':
      default:
        return {
          visibilityBio: 'all_users',
          visibilityCountry: 'all_users',
          visibilityLevelOfEducation: 'all_users',
          visibilityLanguageProficiencies: 'all_users',
          visibilityName: 'all_users',
          visibilitySocialLinks: 'all_users',
        };
    }
  },
);

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
    country: chooseFormValue(drafts.country, account.country),
    visibilityCountry: chooseFormValue(drafts.visibilityCountry, visibilities.visibilityCountry),
    levelOfEducation: chooseFormValue(drafts.levelOfEducation, account.levelOfEducation),
    visibilityLevelOfEducation: chooseFormValue(
      drafts.visibilityLevelOfEducation,
      visibilities.visibilityLevelOfEducation,
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
    socialLinks,
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
  draftSocialLinksByPlatformSelector,
  accountErrorsSelector,
  isAuthenticatedUserProfileSelector,
  (
    account,
    formValues,
    profileImage,
    saveState,
    savePhotoState,
    isLoadingProfile,
    draftSocialLinksByPlatform,
    errors,
    isAuthenticatedUserProfile,
  ) => ({
    username: account.username,
    profileImage,
    requiresParentalConsent: account.requiresParentalConsent,
    dateJoined: account.dateJoined,
    yearOfBirth: account.yearOfBirth,

    bio: formValues.bio,
    visibilityBio: formValues.visibilityBio,

    courseCertificates: formValues.courseCertificates,

    country: formValues.country,
    visibilityCountry: formValues.visibilityCountry,

    levelOfEducation: formValues.levelOfEducation,
    visibilityLevelOfEducation: formValues.visibilityLevelOfEducation,

    languageProficiencies: formValues.languageProficiencies,
    visibilityLanguageProficiencies: formValues.visibilityLanguageProficiencies,

    name: formValues.name,
    visibilityName: formValues.visibilityName,

    socialLinks: formValues.socialLinks,
    visibilitySocialLinks: formValues.visibilitySocialLinks,
    draftSocialLinksByPlatform,

    saveState,
    savePhotoState,
    isLoadingProfile,
    photoUploadError: errors.photo || null,
    isAuthenticatedUserProfile,
  }),
);
