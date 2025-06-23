import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  'profile.viewMyRecords': {
    id: 'profile.viewMyRecords',
    defaultMessage: 'View My Records',
    description: 'A link to go view my academic records',
  },
  'profile.loading': {
    id: 'profile.loading',
    defaultMessage: 'Profile loading...',
    description: 'Message displayed when the profile data is loading.',
  },
  'profile.username': {
    id: 'profile.username',
    defaultMessage: 'Username',
    description: 'Label for the username field.',
  },
  'profile.username.tooltip': {
    id: 'profile.username.tooltip',
    defaultMessage: 'The name that identifies you on edX. You cannot change your username.',
    description: 'Tooltip for the username field.',
  },
});

export default messages;
