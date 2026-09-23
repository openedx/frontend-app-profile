import React from 'react';
import PropTypes from 'prop-types';
import { act, renderHook, waitFor } from '@testing-library/react';

import { configure as configureI18n } from '@edx/frontend-platform/i18n';
import { logError } from '@edx/frontend-platform/logging';

import * as api from './api';
import { ProfileFormContext } from './FormContext';
import {
  CUSTOM_ALL_USERS_PREFERENCES,
  useCountryOptions,
  useDeleteProfilePhoto,
  useEditableForm,
  useMigrateAccountPrivacy,
  useProfileData,
  useSaveProfilePhoto,
} from './hooks';
import { profileKeys } from './queryKeys';
import {
  createFormContextValue,
  createTestQueryClient,
  createWrapper,
} from '../../tests/renderWithProviders';

jest.mock('./api');
jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

configureI18n({
  loggingService: { logError: jest.fn() },
  config: {
    ENVIRONMENT: 'production',
    LANGUAGE_PREFERENCE_COOKIE_NAME: 'yum',
  },
  messages: [],
});

const account = {
  username: 'staff',
  name: 'Lemon Seltzer',
  bio: 'This is my bio',
  country: 'ME',
  levelOfEducation: null,
  languageProficiencies: [{ code: 'yo' }],
  socialLinks: [{ platform: 'facebook', socialLink: 'https://www.facebook.com/aloha' }],
  profileImage: { imageUrlFull: 'http://img/full.jpg', hasImage: true },
  dateJoined: '2017-06-07T00:44:23Z',
  accountPrivacy: 'custom',
  extendedProfile: [],
};
const preferences = { accountPrivacy: 'custom', visibilityBio: 'all_users', visibilityName: 'private' };
const certificates = [{ courseId: 'course-v1:edX+DemoX+Demo_Course', certificateType: 'verified' }];

const createHookWrapper = ({ form = {}, queryClient = createTestQueryClient() } = {}) => {
  const Providers = createWrapper({ queryClient });
  const value = createFormContextValue(form);
  const Wrapper = ({ children }) => (
    <Providers>
      <ProfileFormContext.Provider value={value}>
        {children}
      </ProfileFormContext.Provider>
    </Providers>
  );
  Wrapper.propTypes = {
    children: PropTypes.node.isRequired,
  };
  return { Wrapper, queryClient };
};

beforeEach(() => {
  jest.clearAllMocks();
  api.getAccount.mockResolvedValue(account);
  api.getPreferences.mockResolvedValue(preferences);
  api.getCourseCertificates.mockResolvedValue(certificates);
  api.getCountryList.mockResolvedValue(['US', 'CA']);
});

describe('useProfileData', () => {
  it('gates the page on every request and combines them into the form values', async () => {
    const { Wrapper } = createHookWrapper();
    const { result } = renderHook(() => useProfileData(), { wrapper: Wrapper });

    expect(result.current.isPending).toBe(true);
    await waitFor(() => expect(result.current.isPending).toBe(false));

    expect(result.current).toMatchObject({
      isNotFound: false,
      isError: false,
      name: 'Lemon Seltzer',
      bio: 'This is my bio',
      visibilityName: 'private',
      visibilityBio: 'all_users',
      visibilityCountry: 'all_users',
      courseCertificates: certificates,
      profileImage: { src: 'http://img/full.jpg', isDefault: false },
      dateJoined: '2017-06-07T00:44:23Z',
      accountPrivacy: 'custom',
    });
    expect(result.current.socialLinks).toEqual([
      { platform: 'x', socialLink: null },
      { platform: 'facebook', socialLink: 'https://www.facebook.com/aloha' },
      { platform: 'linkedin', socialLink: null },
    ]);
    expect(api.getAccount).toHaveBeenCalledWith('staff');
    expect(api.getPreferences).toHaveBeenCalledWith('staff');
    expect(api.getCourseCertificates).toHaveBeenCalledWith('staff');
  });

  it('shows drafts over the committed values', async () => {
    const { Wrapper } = createHookWrapper({
      form: { drafts: { bio: 'Draft bio', visibilityBio: 'private' } },
    });
    const { result } = renderHook(() => useProfileData(), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.isPending).toBe(false));
    expect(result.current.bio).toBe('Draft bio');
    expect(result.current.visibilityBio).toBe('private');
    expect(result.current.name).toBe('Lemon Seltzer');
  });

  it("does not read someone else's preferences and shows their fields as public", async () => {
    api.getAccount.mockResolvedValue({ ...account, username: 'other' });
    const { Wrapper } = createHookWrapper({ form: { username: 'other', isOwnProfile: false } });
    const { result } = renderHook(() => useProfileData(), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.isPending).toBe(false));
    expect(api.getPreferences).not.toHaveBeenCalled();
    expect(result.current.visibilityName).toBe('all_users');
  });

  it('reports an unknown user', async () => {
    api.getAccount.mockRejectedValue({ response: { status: 404 } });
    const { Wrapper } = createHookWrapper();
    const { result } = renderHook(() => useProfileData(), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.isNotFound).toBe(true));
    expect(result.current.isError).toBe(false);
    expect(api.getAccount).toHaveBeenCalledTimes(1);
  });

  it('reports any other failure', async () => {
    api.getAccount.mockRejectedValue({ response: { status: 500 } });
    const { Wrapper } = createHookWrapper();
    const { result } = renderHook(() => useProfileData(), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.isNotFound).toBe(false);
  });
});

describe('useEditableForm', () => {
  it("is static on someone else's profile", async () => {
    const { Wrapper } = createHookWrapper({ form: { isOwnProfile: false, currentlyEditingField: 'bio' } });
    const { result } = renderHook(() => useEditableForm('bio'), { wrapper: Wrapper });

    await waitFor(() => expect(api.getAccount).toHaveBeenCalled());
    expect(result.current.editMode).toBe('static');
  });

  it('is editing for the open form, editable for a set field and empty otherwise', async () => {
    const { Wrapper } = createHookWrapper({
      form: {
        currentlyEditingField: 'bio',
        errors: { name: { userMessage: 'Nope' } },
        saveState: 'error',
      },
    });
    const { result } = renderHook(() => ({
      bio: useEditableForm('bio'),
      name: useEditableForm('name'),
      levelOfEducation: useEditableForm('levelOfEducation'),
    }), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.name.editMode).toBe('editable'));
    expect(result.current.bio.editMode).toBe('editing');
    expect(result.current.levelOfEducation.editMode).toBe('empty');
    expect(result.current.name.error).toBe('Nope');
    expect(result.current.bio.error).toBeNull();
    expect(result.current.bio.saveState).toBe('error');
  });
});

describe('useCountryOptions', () => {
  it('offers the allowed countries plus the saved one, named in the locale', async () => {
    const { Wrapper } = createHookWrapper();
    const { result } = renderHook(() => useCountryOptions(), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.translatedCountries).toHaveLength(3));
    expect(result.current.translatedCountries.map(({ code }) => code).sort()).toEqual(['CA', 'ME', 'US']);
    expect(result.current.countryMessages.ME).toBe('Montenegro');
    expect(result.current.countriesCodesList).toEqual(['US', 'CA']);
  });
});

describe('useSaveProfilePhoto', () => {
  it('folds the new image into the cached account', async () => {
    const { Wrapper, queryClient } = createHookWrapper({ queryClient: createTestQueryClient({ gcTime: Infinity }) });
    queryClient.setQueryData(profileKeys.account('staff'), account);
    const profileImage = { imageUrlFull: 'http://img/new.jpg', hasImage: true };
    api.postProfilePhoto.mockResolvedValue(profileImage);
    const { result } = renderHook(() => useSaveProfilePhoto('staff'), { wrapper: Wrapper });

    const formData = new FormData();
    act(() => result.current.mutate(formData));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(api.postProfilePhoto).toHaveBeenCalledWith('staff', formData);
    expect(queryClient.getQueryData(profileKeys.account('staff')).profileImage).toEqual(profileImage);
  });

  it('logs a rejected upload', async () => {
    const { Wrapper } = createHookWrapper();
    const error = new Error('too big');
    api.postProfilePhoto.mockRejectedValue(error);
    const { result } = renderHook(() => useSaveProfilePhoto('staff'), { wrapper: Wrapper });

    act(() => result.current.mutate(new FormData()));

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(logError).toHaveBeenCalledWith(error);
  });
});

describe('useDeleteProfilePhoto', () => {
  it('folds the default image into the cached account', async () => {
    const { Wrapper, queryClient } = createHookWrapper({ queryClient: createTestQueryClient({ gcTime: Infinity }) });
    queryClient.setQueryData(profileKeys.account('staff'), account);
    const profileImage = { imageUrlFull: 'http://img/default.jpg', hasImage: false };
    api.deleteProfilePhoto.mockResolvedValue(profileImage);
    const { result } = renderHook(() => useDeleteProfilePhoto('staff'), { wrapper: Wrapper });

    act(() => result.current.mutate());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(api.deleteProfilePhoto).toHaveBeenCalledWith('staff');
    expect(queryClient.getQueryData(profileKeys.account('staff')).profileImage).toEqual(profileImage);
  });

  it('logs a failed deletion', async () => {
    const { Wrapper } = createHookWrapper();
    const error = new Error('nope');
    api.deleteProfilePhoto.mockRejectedValue(error);
    const { result } = renderHook(() => useDeleteProfilePhoto('staff'), { wrapper: Wrapper });

    act(() => result.current.mutate());

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(logError).toHaveBeenCalledWith(error);
  });
});

describe('useMigrateAccountPrivacy', () => {
  it('moves the account to per-field privacy and refetches it', async () => {
    const { Wrapper, queryClient } = createHookWrapper();
    const invalidateQueries = jest.spyOn(queryClient, 'invalidateQueries');
    api.patchPreferences.mockResolvedValue({});
    const { result } = renderHook(() => useMigrateAccountPrivacy('staff'), { wrapper: Wrapper });

    act(() => result.current.mutate());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(api.patchPreferences).toHaveBeenCalledWith('staff', CUSTOM_ALL_USERS_PREFERENCES);
    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: profileKeys.account('staff') });
    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: profileKeys.preferences('staff') });
  });
});
