import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { breakpoints, useWindowSize } from '@openedx/paragon';
import { logError, useAppConfig, useIntl } from '@openedx/frontend-base';

import { getCountryList as getTranslatedCountryList, getCountryMessages } from '@src/data/countries';
import { getLanguageList, getLanguageMessages } from '@src/data/languages';
import { parseEnvBoolean } from '@src/utils';

import { retryUnlessClientError } from '@src/data/queryOptions';
import {
  deleteProfilePhoto,
  getAccount,
  getCountryList,
  getCourseCertificates,
  getPreferences,
  patchPreferences,
  postProfilePhoto,
} from '@src/profile/data/api';
import {
  getDraftSocialLinksByPlatform,
  getEditMode,
  getFormError,
  getFormValues,
  getProfileImage,
  getSortedCountries,
} from '@src/profile/data/derive';
import { useProfileForm } from '@src/profile/data/FormContext';
import { profileKeys, profileMutationKeys } from '@src/profile/data/queryKeys';

const EMPTY_LIST = [];
const EMPTY_OBJECT = {};

export function useIsOnTabletScreen() {
  const windowSize = useWindowSize();
  return windowSize.width <= breakpoints.medium.minWidth;
}

export function useIsOnMobileScreen() {
  const windowSize = useWindowSize();
  return windowSize.width <= breakpoints.small.minWidth;
}

export function useIsVisibilityEnabled() {
  return !parseEnvBoolean(useAppConfig().DISABLE_VISIBILITY_EDITING);
}

export function useHandleChange(changeHandler) {
  return (e) => {
    const { name, value } = e.target;
    changeHandler(name, value);
  };
}

export function useHandleSubmit(submitHandler, formId) {
  return (e) => {
    e.preventDefault();
    submitHandler(formId);
  };
}

export function useCloseOpenHandler(handler, formId) {
  return () => handler(formId);
}

/**
 * The viewed account. A 404 is an unknown user, which must not be retried before the page says so.
 */
export const useAccount = (username) => useQuery({
  queryKey: profileKeys.account(username),
  queryFn: () => getAccount(username),
  retry: retryUnlessClientError,
});

/**
 * The visibility preferences, which only the profile's owner may read.
 */
export const usePreferences = (username, { enabled = true } = {}) => useQuery({
  queryKey: profileKeys.preferences(username),
  queryFn: () => getPreferences(username),
  enabled,
  retry: retryUnlessClientError,
});

export const useCourseCertificates = (username) => useQuery({
  queryKey: profileKeys.courseCertificates(username),
  queryFn: () => getCourseCertificates(username),
});

/**
 * The country codes the LMS registration form allows, which is what the country select offers.
 */
export const useCountryCodes = () => useQuery({
  queryKey: profileKeys.countryCodes,
  queryFn: getCountryList,
  staleTime: Infinity,
});

/**
 * Everything the profile page renders from, combining the queries above with the form state.
 * `isPending` gates the whole page, as the single fetch used to.
 */
export const useProfileData = () => {
  const { username, isOwnProfile, drafts } = useProfileForm();
  const account = useAccount(username);
  const preferences = usePreferences(username, { enabled: isOwnProfile });
  const certificates = useCourseCertificates(username);
  const countryCodes = useCountryCodes();

  const isPending = account.isPending
    || certificates.isPending
    || countryCodes.isPending
    || (isOwnProfile && preferences.isPending);
  const isNotFound = account.error?.response?.status === 404;
  const isError = (account.isError && !isNotFound) || preferences.isError;

  const accountData = account.data ?? EMPTY_OBJECT;
  const preferencesData = preferences.data ?? EMPTY_OBJECT;
  const certificatesData = certificates.data ?? EMPTY_LIST;

  const formValues = useMemo(() => getFormValues({
    account: accountData,
    preferences: preferencesData,
    drafts,
    certificates: certificatesData,
  }), [accountData, preferencesData, drafts, certificatesData]);

  return {
    isPending,
    isNotFound,
    isError,
    accountPrivacy: accountData.accountPrivacy,
    dateJoined: accountData.dateJoined,
    profileImage: getProfileImage(account.data),
    ...formValues,
    draftSocialLinksByPlatform: getDraftSocialLinksByPlatform(drafts),
  };
};

/**
 * What one editable field needs to know about the form it belongs to.
 */
export const useEditableForm = (formId) => {
  const {
    username, isOwnProfile, currentlyEditingField, errors, saveState,
  } = useProfileForm();
  const { data: account } = useAccount(username);

  return {
    editMode: getEditMode({
      formId,
      account: account ?? EMPTY_OBJECT,
      isOwnProfile,
      currentlyEditingField,
    }),
    error: getFormError(errors, formId),
    saveState,
  };
};

/**
 * The options of the country select, in the current locale: the countries the LMS allows plus
 * the one already saved on the account.
 */
export const useCountryOptions = () => {
  const { username } = useProfileForm();
  const { data: account } = useAccount(username);
  const { data: countryCodes = EMPTY_LIST } = useCountryCodes();
  const { locale } = useIntl();
  const committedCountry = account?.country;

  return useMemo(() => ({
    translatedCountries: getSortedCountries(getTranslatedCountryList(locale), countryCodes, committedCountry),
    countryMessages: getCountryMessages(locale),
    countriesCodesList: countryCodes,
  }), [locale, countryCodes, committedCountry]);
};

/**
 * The options of the preferred language select, in the current locale.
 */
export const useLanguageOptions = () => {
  const { locale } = useIntl();

  return useMemo(() => ({
    sortedLanguages: getLanguageList(locale),
    languageMessages: getLanguageMessages(locale),
  }), [locale]);
};

const useUpdateProfileImage = (username) => {
  const queryClient = useQueryClient();
  return (profileImage) => queryClient.setQueryData(
    profileKeys.account(username),
    (current) => (current ? { ...current, profileImage } : current),
  );
};

export const useSaveProfilePhoto = (username) => {
  const updateProfileImage = useUpdateProfileImage(username);
  return useMutation({
    mutationKey: profileMutationKeys.saveProfilePhoto,
    mutationFn: (formData) => postProfilePhoto(username, formData),
    onSuccess: updateProfileImage,
    onError: (error) => logError(error),
  });
};

export const useDeleteProfilePhoto = (username) => {
  const updateProfileImage = useUpdateProfileImage(username);
  return useMutation({
    mutationKey: profileMutationKeys.deleteProfilePhoto,
    mutationFn: () => deleteProfilePhoto(username),
    onSuccess: updateProfileImage,
    onError: (error) => logError(error),
  });
};

// The per-field privacy model that replaces the legacy "everything public" one.
export const CUSTOM_ALL_USERS_PREFERENCES = {
  account_privacy: 'custom',
  'visibility.name': 'all_users',
  'visibility.bio': 'all_users',
  'visibility.course_certificates': 'all_users',
  'visibility.country': 'all_users',
  'visibility.date_joined': 'all_users',
  'visibility.level_of_education': 'all_users',
  'visibility.language_proficiencies': 'all_users',
  'visibility.social_links': 'all_users',
  'visibility.time_zone': 'all_users',
};

/**
 * Moves an account still on the legacy `all_users` privacy setting to the per-field model, with
 * every field public, so the visibility controls have something to edit.
 */
export const useMigrateAccountPrivacy = (username) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: profileMutationKeys.migrateAccountPrivacy,
    mutationFn: () => patchPreferences(username, CUSTOM_ALL_USERS_PREFERENCES),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.account(username) });
      queryClient.invalidateQueries({ queryKey: profileKeys.preferences(username) });
    },
    onError: (error) => logError(error),
  });
};
