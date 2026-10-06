import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  'profile.image.alt.attribute': {
    id: 'profile.image.alt.attribute',
    defaultMessage: 'profile avatar',
    description: 'Alt attribute for a profile photo',
  },
  'profile.profileavatar.change-button': {
    id: 'profile.profileavatar.change-button',
    defaultMessage: 'Change',
    description: 'Change photo button',
  },
  'profile.profileavatar.tooltip.edit': {
    id: 'profile.profileavatar.tooltip.edit',
    defaultMessage: 'Edit photo',
    description: 'Tooltip for edit photo button',
  },
  'profile.profileavatar.tooltip.upload': {
    id: 'profile.profileavatar.tooltip.upload',
    defaultMessage: 'Upload photo',
    description: 'Tooltip for upload photo button',
  },
  'profile.profileavatar.error.too-large': {
    id: 'profile.profileavatar.error.too-large',
    defaultMessage: 'Your photo could not be uploaded because it exceeds the maximum size of 1MB. Please choose a smaller JPG or PNG file.',
    description: 'Error message shown when the selected avatar file exceeds the maximum allowed size',
  },
  'profile.profileavatar.error.invalid-type': {
    id: 'profile.profileavatar.error.invalid-type',
    defaultMessage: 'Your photo could not be uploaded because the file type is not supported. Please choose a JPG or PNG image.',
    description: 'Error message shown when the selected avatar file is not a supported image type',
  },
});

export default messages;
