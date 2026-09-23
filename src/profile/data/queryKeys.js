const BASE_KEY = ['profile'];

export const profileKeys = {
  all: BASE_KEY,
  account: (username) => [...BASE_KEY, 'account', username],
  preferences: (username) => [...BASE_KEY, 'preferences', username],
  courseCertificates: (username) => [...BASE_KEY, 'course-certificates', username],
  countryCodes: [...BASE_KEY, 'country-codes'],
};

export const profileMutationKeys = {
  saveProfile: [...BASE_KEY, 'save-profile'],
  saveProfilePhoto: [...BASE_KEY, 'save-profile-photo'],
  deleteProfilePhoto: [...BASE_KEY, 'delete-profile-photo'],
  migrateAccountPrivacy: [...BASE_KEY, 'migrate-account-privacy'],
};
