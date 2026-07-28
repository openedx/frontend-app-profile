import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
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
  'profile.profile.information': {
    id: 'profile.profile.information',
    defaultMessage: 'Profile information',
    description: 'heading for the editable profile section',
  },
  'profile.profile.information.mobile': {
    id: 'profile.profile.information.mobile',
    defaultMessage: 'Profile',
    description: 'heading for the editable profile section in mobile view',
  },
});

export default messages;
