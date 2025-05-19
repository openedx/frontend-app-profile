import { PluginSlot } from '@openedx/frontend-plugin-framework';
import ExtendedProfileFields from '../../profile/extended-profile';

const ExtendedProfileFieldsSlot = () => (
  <PluginSlot
    id="org.openedx.frontend.profile.extended_profile_fields.v1"
    idAliases={['extended_profile_fields_plugin']}
  >
    <ExtendedProfileFields />
  </PluginSlot>
);

export default ExtendedProfileFieldsSlot;
