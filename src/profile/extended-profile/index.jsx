import ExtendedProfileFieldsProvider from './ExtendedProfileProvider';
import ProfileFields from './profile-fields';

const ExtendedProfileFields = () => (
  <ExtendedProfileFieldsProvider>
    <ProfileFields />
  </ExtendedProfileFieldsProvider>
);

export default ExtendedProfileFields;
