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
  'profile.profileavatar.error.filesize': {
    id: 'profile.profileavatar.error.filesize',
    defaultMessage: 'The file size limit is 1 MB. Please choose a smaller photo and try again.',
    description: 'Error shown when uploaded photo exceeds the maximum file size',
  },
  'profile.profileavatar.error.filetype': {
    id: 'profile.profileavatar.error.filetype',
    defaultMessage: 'Only JPG and PNG image files are supported. Please choose a different photo and try again.',
    description: 'Error shown when uploaded photo is not a supported file type',
  },
});

export default messages;
