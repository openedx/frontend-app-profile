import React from 'react';
import PropTypes from 'prop-types';
import { act, renderHook, waitFor } from '@testing-library/react';

import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import { logError } from '@edx/frontend-platform/logging';

import * as api from './api';
import { CLOSE_FORM_DELAY, ProfileFormProvider, useProfileForm } from './FormContext';
import { profileKeys } from './queryKeys';
import { createTestQueryClient, createWrapper } from '../../tests/renderWithProviders';

jest.mock('./api');
jest.mock('@edx/frontend-platform/auth', () => ({
  getAuthenticatedUser: jest.fn(),
}));
jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

const renderForm = ({ username = 'staff', queryClient = createTestQueryClient() } = {}) => {
  const Providers = createWrapper({ queryClient });
  const Wrapper = ({ children }) => (
    <Providers>
      <ProfileFormProvider username={username}>
        {children}
      </ProfileFormProvider>
    </Providers>
  );
  Wrapper.propTypes = {
    children: PropTypes.node.isRequired,
  };
  return { queryClient, ...renderHook(() => useProfileForm(), { wrapper: Wrapper }) };
};

beforeEach(() => {
  jest.clearAllMocks();
  getAuthenticatedUser.mockReturnValue({ username: 'staff' });
});

describe('ProfileFormProvider', () => {
  it('knows whose profile it is', () => {
    expect(renderForm().result.current).toMatchObject({ username: 'staff', isOwnProfile: true });
    expect(renderForm({ username: 'other' }).result.current).toMatchObject({ username: 'other', isOwnProfile: false });
  });

  it('opens one form at a time and only lets that form close itself', () => {
    const { result } = renderForm();

    act(() => result.current.openForm('bio'));
    act(() => result.current.updateDraft('bio', 'Draft bio'));
    expect(result.current.currentlyEditingField).toBe('bio');
    expect(result.current.drafts).toEqual({ bio: 'Draft bio' });

    act(() => result.current.closeForm('name'));
    expect(result.current.currentlyEditingField).toBe('bio');
    expect(result.current.drafts).toEqual({ bio: 'Draft bio' });

    act(() => result.current.closeForm('bio'));
    expect(result.current.currentlyEditingField).toBeNull();
    expect(result.current.drafts).toEqual({});
  });

  describe('saveProfile', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('saves the account drafts, merges the response and closes the form after a moment', async () => {
      const { result, queryClient } = renderForm({ queryClient: createTestQueryClient({ gcTime: Infinity }) });
      queryClient.setQueryData(profileKeys.account('staff'), { name: 'Lemon Seltzer', bio: 'Old bio' });
      api.patchProfile.mockResolvedValue({ bio: 'New bio' });

      act(() => result.current.openForm('bio'));
      act(() => result.current.updateDraft('bio', 'New bio'));
      act(() => result.current.saveProfile('bio'));

      await waitFor(() => expect(result.current.saveState).toBe('complete'));
      expect(api.patchProfile).toHaveBeenCalledWith('staff', { bio: 'New bio' });
      expect(api.patchPreferences).not.toHaveBeenCalled();
      expect(queryClient.getQueryData(profileKeys.account('staff'))).toEqual({ name: 'Lemon Seltzer', bio: 'New bio' });
      expect(result.current.currentlyEditingField).toBe('bio');

      act(() => jest.advanceTimersByTime(CLOSE_FORM_DELAY));
      expect(result.current.currentlyEditingField).toBeNull();
      expect(result.current.saveState).toBeNull();
      expect(result.current.drafts).toEqual({});
    });

    it('saves the visibilities through the preferences and reads them back', async () => {
      const { result, queryClient } = renderForm({ queryClient: createTestQueryClient({ gcTime: Infinity }) });
      queryClient.setQueryData(profileKeys.preferences('staff'), { accountPrivacy: 'custom', visibilityName: 'private' });
      api.patchPreferences.mockResolvedValue({});
      api.getPreferences.mockResolvedValue({ accountPrivacy: 'custom', visibilityBio: 'private' });

      act(() => result.current.openForm('bio'));
      act(() => result.current.updateDraft('visibilityBio', 'private'));
      act(() => result.current.saveProfile('bio'));

      await waitFor(() => expect(result.current.saveState).toBe('complete'));
      expect(api.patchProfile).not.toHaveBeenCalled();
      expect(api.patchPreferences).toHaveBeenCalledWith('staff', { visibilityBio: 'private', accountPrivacy: 'custom' });
      expect(api.getPreferences).toHaveBeenCalledWith('staff');
      expect(queryClient.getQueryData(profileKeys.preferences('staff'))).toEqual({
        accountPrivacy: 'custom',
        visibilityName: 'private',
        visibilityBio: 'private',
      });
    });

    it('keeps the form open with the field errors the server sent', async () => {
      const { result } = renderForm();
      const error = new Error('Bad Request');
      error.processedData = { fieldErrors: { bio: { userMessage: 'Too long' } } };
      api.patchProfile.mockRejectedValue(error);

      act(() => result.current.openForm('bio'));
      act(() => result.current.updateDraft('bio', 'x'.repeat(4000)));
      act(() => result.current.saveProfile('bio'));

      await waitFor(() => expect(result.current.saveState).toBe('error'));
      expect(result.current.errors).toEqual({ bio: { userMessage: 'Too long' } });
      expect(result.current.currentlyEditingField).toBe('bio');
      expect(logError).not.toHaveBeenCalled();
    });

    it('logs any other failure and resets the save, leaving the form open', async () => {
      const { result } = renderForm();
      const error = new Error('boom');
      api.patchProfile.mockRejectedValue(error);

      act(() => result.current.openForm('bio'));
      act(() => result.current.updateDraft('bio', 'New bio'));
      act(() => result.current.saveProfile('bio'));

      await waitFor(() => expect(logError).toHaveBeenCalledWith(error));
      await waitFor(() => expect(result.current.saveState).toBeNull());
      expect(result.current.errors).toEqual({});
      expect(result.current.currentlyEditingField).toBe('bio');
    });
  });
});

describe('useProfileForm', () => {
  it('refuses to work outside the provider', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useProfileForm())).toThrow('useProfileForm must be used within a ProfileFormProvider');
    console.error.mockRestore(); // eslint-disable-line no-console
  });
});
