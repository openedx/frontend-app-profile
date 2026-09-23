import { useCallback } from 'react';
import { Slot } from '@openedx/frontend-base';
import { useQueryClient } from '@tanstack/react-query';

import { patchProfile } from '../../profile/data/api';
import { useProfileForm } from '../../profile/data/FormContext';
import { useAccount } from '../../profile/data/hooks';
import { profileKeys } from '../../profile/data/queryKeys';

import SwitchContent from '../../profile/forms/elements/SwitchContent';
import EmptyContent from '../../profile/forms/elements/EmptyContent';
import EditableItemHeader from '../../profile/forms/elements/EditableItemHeader';

const AdditionalProfileFieldsSlot = () => {
  const queryClient = useQueryClient();
  const { username, errors } = useProfileForm();
  const { data: account } = useAccount(username);

  const refreshUserProfile = useCallback(
    (profileUsername = username) => queryClient.invalidateQueries({
      queryKey: profileKeys.account(profileUsername),
    }),
    [queryClient, username],
  );

  // Saves the fields and folds the response into the cached account, so the page shows the new
  // values without a refetch.
  const updateUserProfile = useCallback(async (profileUsername, params) => {
    const updatedAccount = await patchProfile(profileUsername, params);
    queryClient.setQueryData(
      profileKeys.account(profileUsername),
      (current) => (current ? { ...current, ...updatedAccount } : current),
    );
    return updatedAccount;
  }, [queryClient]);

  // These reach the widgets as slot props; see the README for their contract.
  const slotProps = {
    refreshUserProfile,
    updateUserProfile,
    profileFieldValues: account?.extendedProfile,
    profileFieldErrors: errors,
    formComponents: {
      SwitchContent,
      EmptyContent,
      EditableItemHeader,
    },
  };

  return (
    <Slot
      id="org.openedx.frontend.profile.additional_profile_fields.v1"
      {...slotProps}
    />
  );
};

export default AdditionalProfileFieldsSlot;
