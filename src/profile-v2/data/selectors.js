import { createSelector } from 'reselect';

export const userAccountSelector = state => state.userAccount;

export const profileAccountSelector = state => state.profilePage.account;
export const profileCourseCertificatesSelector = state => state.profilePage.courseCertificates;
export const savePhotoStateSelector = state => state.profilePage.savePhotoState;
export const isLoadingProfileSelector = state => state.profilePage.isLoadingProfile;
export const accountErrorsSelector = state => state.profilePage.errors;

export const certificatesSelector = createSelector(
  profileCourseCertificatesSelector,
  (certificates) => ({
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

export const profilePageSelector = createSelector(
  profileAccountSelector,
  profileCourseCertificatesSelector,
  profileImageSelector,
  savePhotoStateSelector,
  isLoadingProfileSelector,
  accountErrorsSelector,
  (
    account,
    courseCertificates,
    profileImage,
    savePhotoState,
    isLoadingProfile,
    errors,
  ) => ({
    // Account data we need
    username: account.username,
    profileImage,
    requiresParentalConsent: account.requiresParentalConsent,
    dateJoined: account.dateJoined,
    yearOfBirth: account.yearOfBirth,
    name: account.name,

    courseCertificates,

    // Other data we need
    savePhotoState,
    isLoadingProfile,
    photoUploadError: errors.photo || null,
  }),
);
