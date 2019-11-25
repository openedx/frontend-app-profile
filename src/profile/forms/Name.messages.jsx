import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  'profile.name.full.name': {
    id: 'profile.name.full.name',
    defaultMessage: 'Full Name',
    description: 'A section of a user profile',
  },
  'profile.name.details': {
    id: 'profile.name.details',
    defaultMessage: 'This is the name that appears in your account and on your certificates.',
    description: 'Describes the area for a user to update their name.',
  },
  'profile.name.empty': {
    id: 'profile.name.empty',
    defaultMessage: 'Add name',
    description: 'The affordance to add a name to a user’s profile.',
  },
});

export default messages;
