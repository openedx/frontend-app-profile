/**
 * Pure derivations from the server data and the form state. These are what the reselect
 * selectors used to compute; keeping them as plain functions keeps them testable without React.
 */

export const ACCOUNT_DRAFT_KEYS = [
  'bio',
  'country',
  'levelOfEducation',
  'languageProficiencies',
  'name',
  'socialLinks',
];

export const PREFERENCE_DRAFT_KEYS = [
  'visibilityBio',
  'visibilityCountry',
  'visibilityLevelOfEducation',
  'visibilityLanguageProficiencies',
  'visibilityName',
  'visibilitySocialLinks',
];

export const KNOWN_SOCIAL_PLATFORMS = ['x', 'facebook', 'linkedin'];

const pick = (object, keys) => Object.fromEntries(
  Object.entries(object).filter(([key]) => keys.includes(key)),
);

/**
 * The drafts that belong to the account endpoint.
 */
export function pickAccountDrafts(drafts) {
  return pick(drafts, ACCOUNT_DRAFT_KEYS);
}

/**
 * The drafts that belong to the preferences endpoint. Saving any visibility switches the
 * account to the per-field privacy model.
 */
export function pickPreferencesDrafts(drafts) {
  const preferencesDrafts = pick(drafts, PREFERENCE_DRAFT_KEYS);
  if (Object.keys(preferencesDrafts).length > 0) {
    preferencesDrafts.accountPrivacy = 'custom';
  }
  return preferencesDrafts;
}

/**
 * How a field renders: read-only on someone else's profile, the open editor, an "add" prompt
 * when it has no value, or its value with an edit button.
 */
export function getEditMode({
  formId, account, isOwnProfile, currentlyEditingField,
}) {
  if (!isOwnProfile) {
    return 'static';
  }
  if (formId === currentlyEditingField) {
    return 'editing';
  }
  const value = account[formId];
  const propExists = value != null && value.length > 0;
  if (!propExists) {
    return 'empty';
  }
  return 'editable';
}

export function getFormError(errors, formId) {
  return errors[formId] ? errors[formId].userMessage : null;
}

/**
 * Per-field visibilities from the preferences. `custom` reads each preference (defaulting to
 * public), `private` hides everything, and the legacy `all_users` (or no preferences at all, as
 * on someone else's profile, where the LMS has already filtered the fields) shows everything.
 */
export function getVisibilities(preferences = {}) {
  switch (preferences.accountPrivacy) {
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
}

export function getProfileImage(account) {
  if (account?.profileImage == null) {
    return {};
  }
  return {
    src: account.profileImage.imageUrlFull,
    isDefault: !account.profileImage.hasImage,
  };
}

const socialLinksByPlatform = (socialLinks) => {
  const linksByPlatform = {};
  if (Array.isArray(socialLinks)) {
    socialLinks.forEach((socialLink) => {
      linksByPlatform[socialLink.platform] = socialLink;
    });
  }
  return linksByPlatform;
};

export function getDraftSocialLinksByPlatform(drafts) {
  return socialLinksByPlatform(drafts.socialLinks);
}

/**
 * One entry per known platform: the draft if there is one, else the saved link, else an empty
 * link, in a fixed order so the form always shows every platform.
 */
export function getFormSocialLinks(account, drafts) {
  const linksByPlatform = socialLinksByPlatform(account.socialLinks);
  const draftLinksByPlatform = getDraftSocialLinksByPlatform(drafts);
  return KNOWN_SOCIAL_PLATFORMS.map((platform) => {
    if (draftLinksByPlatform[platform] !== undefined) {
      return draftLinksByPlatform[platform];
    }
    if (linksByPlatform[platform] !== undefined) {
      return linksByPlatform[platform];
    }
    return { platform, socialLink: null };
  });
}

const chooseFormValue = (draft, committed) => (draft !== undefined ? draft : committed);

/**
 * What the form shows for each field: the draft when there is one, the committed value otherwise.
 */
export function getFormValues({
  account, preferences, drafts, certificates,
}) {
  const visibilities = getVisibilities(preferences);
  return {
    bio: chooseFormValue(drafts.bio, account.bio),
    visibilityBio: chooseFormValue(drafts.visibilityBio, visibilities.visibilityBio),
    courseCertificates: certificates,
    country: chooseFormValue(drafts.country, account.country),
    visibilityCountry: chooseFormValue(drafts.visibilityCountry, visibilities.visibilityCountry),
    levelOfEducation: chooseFormValue(drafts.levelOfEducation, account.levelOfEducation),
    visibilityLevelOfEducation: chooseFormValue(
      drafts.visibilityLevelOfEducation,
      visibilities.visibilityLevelOfEducation,
    ),
    languageProficiencies: chooseFormValue(drafts.languageProficiencies, account.languageProficiencies),
    visibilityLanguageProficiencies: chooseFormValue(
      drafts.visibilityLanguageProficiencies,
      visibilities.visibilityLanguageProficiencies,
    ),
    name: chooseFormValue(drafts.name, account.name),
    visibilityName: chooseFormValue(drafts.visibilityName, visibilities.visibilityName),
    socialLinks: getFormSocialLinks(account, drafts),
    visibilitySocialLinks: chooseFormValue(drafts.visibilitySocialLinks, visibilities.visibilitySocialLinks),
  };
}

/**
 * The countries the select offers: those the LMS registration form allows, plus the user's own
 * country so a saved value never disappears from the list.
 */
export function getSortedCountries(countryList, countryCodes, userCountry) {
  return countryList.filter(({ code }) => code === userCountry || countryCodes.includes(code));
}
