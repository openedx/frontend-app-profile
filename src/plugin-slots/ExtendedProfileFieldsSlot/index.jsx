import { PluginSlot } from '@openedx/frontend-plugin-framework';
import { useDispatch, useSelector } from 'react-redux';

import { patchProfile } from '../../profile/data/services';
import { fetchProfile } from '../../profile/data/actions';

import SwitchContent from '../../profile/forms/elements/SwitchContent';
import EmptyContent from '../../profile/forms/elements/EmptyContent';
import EditableItemHeader from '../../profile/forms/elements/EditableItemHeader';

const ExtendedProfileFieldsSlot = () => {
  const dispatch = useDispatch();
  const extendedProfileValues = useSelector((state) => state.profilePage.account.extendedProfile);

  const pluginProps = {
    refreshUserProfile: (username) => dispatch(fetchProfile(username)),
    updateUserProfile: patchProfile,
    profileFieldValues: extendedProfileValues,
    formComponents: {
      SwitchContent,
      EmptyContent,
      EditableItemHeader,
    },
  };

  return (
    <PluginSlot
      id="org.openedx.frontend.profile.extended_profile_fields.v1"
      idAliases={['extended_profile_fields_slot']}
      pluginProps={pluginProps}
    />
  );
};

export default ExtendedProfileFieldsSlot;
