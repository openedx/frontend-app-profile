import React, {
  createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef,
} from 'react';
import PropTypes from 'prop-types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import { logError } from '@edx/frontend-platform/logging';

import { getPreferences, patchPreferences, patchProfile } from './api';
import { pickAccountDrafts, pickPreferencesDrafts } from './derive';
import {
  CLOSE_FORM,
  formReducer,
  initialFormState,
  OPEN_FORM,
  SAVE_BEGIN,
  SAVE_FAILURE,
  SAVE_RESET,
  SAVE_SUCCESS,
  UPDATE_DRAFT,
} from './formReducer';
import { profileKeys, profileMutationKeys } from './queryKeys';

// How long a saved field stays in its "complete" state before the form closes itself.
export const CLOSE_FORM_DELAY = 1000;

export const ProfileFormContext = createContext(null);

/**
 * Saves the drafts of one form: the account fields through the accounts API and the visibility
 * preferences through the preferences API, which returns nothing useful and is read back.
 */
export const saveProfileRequest = async ({ username, drafts }) => {
  const accountDrafts = pickAccountDrafts(drafts);
  const preferencesDrafts = pickPreferencesDrafts(drafts);

  let account = null;
  if (Object.keys(accountDrafts).length > 0) {
    account = await patchProfile(username, accountDrafts);
  }

  let preferences = null;
  if (Object.keys(preferencesDrafts).length > 0) {
    await patchPreferences(username, preferencesDrafts);
    preferences = await getPreferences(username);
  }

  return { account, preferences };
};

export const ProfileFormProvider = ({ username, children }) => {
  const [state, dispatch] = useReducer(formReducer, initialFormState);
  const queryClient = useQueryClient();
  const closeTimer = useRef(null);
  const isOwnProfile = username === getAuthenticatedUser()?.username;

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  const scheduleCloseForm = useCallback((formId) => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => dispatch({ type: CLOSE_FORM, formId }), CLOSE_FORM_DELAY);
  }, []);

  const saveMutation = useMutation({
    mutationKey: profileMutationKeys.saveProfile,
    mutationFn: saveProfileRequest,
    onMutate: () => dispatch({ type: SAVE_BEGIN }),
    onSuccess: ({ account, preferences }, { formId }) => {
      // Merge into what is cached; if nothing is, leave it to the next fetch rather than seed the
      // cache with a partial account.
      if (account) {
        queryClient.setQueryData(
          profileKeys.account(username),
          (current) => (current ? { ...current, ...account } : current),
        );
      }
      if (preferences) {
        queryClient.setQueryData(
          profileKeys.preferences(username),
          (current) => (current ? { ...current, ...preferences } : current),
        );
      }
      dispatch({ type: SAVE_SUCCESS });
      scheduleCloseForm(formId);
    },
    onError: (error) => {
      if (error.processedData?.fieldErrors) {
        dispatch({ type: SAVE_FAILURE, errors: error.processedData.fieldErrors });
      } else {
        logError(error);
        dispatch({ type: SAVE_RESET });
      }
    },
  });

  const { mutate: mutateSave } = saveMutation;

  const value = useMemo(() => ({
    ...state,
    username,
    isOwnProfile,
    openForm: (formId) => dispatch({ type: OPEN_FORM, formId }),
    closeForm: (formId) => dispatch({ type: CLOSE_FORM, formId }),
    updateDraft: (name, draftValue) => dispatch({ type: UPDATE_DRAFT, name, value: draftValue }),
    saveProfile: (formId) => mutateSave({ formId, username, drafts: state.drafts }),
  }), [state, username, isOwnProfile, mutateSave]);

  return (
    <ProfileFormContext.Provider value={value}>
      {children}
    </ProfileFormContext.Provider>
  );
};

ProfileFormProvider.propTypes = {
  username: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export const useProfileForm = () => {
  const context = useContext(ProfileFormContext);
  if (context === null) {
    throw new Error('useProfileForm must be used within a ProfileFormProvider');
  }
  return context;
};
