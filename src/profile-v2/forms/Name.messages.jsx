import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  'profile.name.full.name': {
    id: 'profile.name.full.name',
    defaultMessage: 'Full name',
    description: 'A section of a user profile',
  },
  'profile.name.empty': {
    id: 'profile.name.empty',
    defaultMessage: 'Add full name',
    description: 'The affordance to add a name to a user’s profile.',
  },
  'profile.name.tooltip': {
    id: 'profile.name.tooltip',
    defaultMessage: 'The name that is used for ID verification and that appears on your certificates',
    description: 'Tooltip for the full name field.',
  },
});

export default messages;
