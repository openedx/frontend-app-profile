import { PluginSlot } from '@openedx/frontend-plugin-framework';
import { useDispatch, useSelector } from 'react-redux';

import { useCallback } from 'react';
import { patchProfile } from '../../profile/data/services';
import { fetchProfile } from '../../profile/data/actions';

import SwitchContent from '../../profile/forms/elements/SwitchContent';
import EmptyContent from '../../profile/forms/elements/EmptyContent';
import EditableItemHeader from '../../profile/forms/elements/EditableItemHeader';

const AdditionalProfileFieldsSlot = () => {
  const dispatch = useDispatch();
  const extendedProfileValues = useSelector((state) => state.profilePage.account.extendedProfile);
  const errors = useSelector((state) => state.profilePage.errors);

  const pluginProps = {
    refreshUserProfile: useCallback((username) => dispatch(fetchProfile(username)), [dispatch]),
    updateUserProfile: patchProfile,
    profileFieldValues: extendedProfileValues,
    profileFieldErrors: errors,
    formComponents: {
      SwitchContent,
      EmptyContent,
      EditableItemHeader,
    },
  };

  return (
    <PluginSlot
      id="org.openedx.frontend.profile.additional_profile_fields.v1"
      pluginProps={pluginProps}
    />
  );
};

export default AdditionalProfileFieldsSlot;
