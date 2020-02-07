import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  'profile.displayname.name': {
    id: 'profile.displayname.name',
    defaultMessage: 'Display Name',
    description: 'A section of a user profile',
  },
  'profile.displayname.details': {
    id: 'profile.name.details',
    defaultMessage: 'This is the name that appears in your account and on your certificates.',
    description: 'Describes the area for a user to update their name.',
  },
  'profile.displayname.empty': {
    id: 'profile.name.empty',
    defaultMessage: 'Add name',
    description: 'The affordance to add a name to a user’s profile.',
  },
});

export default messages;
