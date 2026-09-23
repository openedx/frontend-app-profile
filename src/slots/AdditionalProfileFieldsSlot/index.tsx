import { useCallback } from 'react';
import { Slot } from '@openedx/frontend-base';
import { useQueryClient } from '@tanstack/react-query';

import { patchProfile } from '@src/profile/data/api';
import { useProfileForm } from '@src/profile/data/FormContext';
import { useAccount } from '@src/profile/data/hooks';
import { profileKeys } from '@src/profile/data/queryKeys';

import EditableItemHeader from '@src/profile/forms/elements/EditableItemHeader';
import EmptyContent from '@src/profile/forms/elements/EmptyContent';
import SwitchContent from '@src/profile/forms/elements/SwitchContent';

// Static, so it keeps its identity between renders and `Slot`'s memo can do its job.
const formComponents = {
  SwitchContent,
  EmptyContent,
  EditableItemHeader,
};

const AdditionalProfileFieldsSlot = () => {
  const queryClient = useQueryClient();
  const { username, errors } = useProfileForm();
  const { data: account } = useAccount(username);

  const refreshUserProfile = useCallback(
    (profileUsername: string = username) => queryClient.invalidateQueries({
      queryKey: profileKeys.account(profileUsername),
    }),
    [queryClient, username],
  );

  // Saves the fields and folds the response into the cached account, so the page shows the new
  // values without a refetch.
  const updateUserProfile = useCallback(async (profileUsername: string, params: object) => {
    const updatedAccount = await patchProfile(profileUsername, params);
    queryClient.setQueryData(
      profileKeys.account(profileUsername),
      (current: object | undefined) => (current ? { ...current, ...updatedAccount } : current),
    );
    return updatedAccount;
  }, [queryClient]);

  // These reach the widgets as slot props; see the README for their contract.
  const slotProps = {
    refreshUserProfile,
    updateUserProfile,
    profileFieldValues: account?.extendedProfile,
    profileFieldErrors: errors,
    formComponents,
  };

  return (
    <Slot
      id="org.openedx.frontend.slot.profile.additionalProfileFields.v1"
      {...slotProps}
    />
  );
};

export default AdditionalProfileFieldsSlot;
