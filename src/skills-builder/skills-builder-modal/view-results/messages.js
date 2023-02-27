import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  matchesFoundSuccessAlert: {
    id: 'matches.found.success.alert',
    defaultMessage: 'We found skills and courses that match your preferences!',
    description: 'Success alert message to display when recommendations are presented to the learner.',
  },
  relatedSkillsHeading: {
    id: 'related.skills.heading',
    defaultMessage: 'Related Skills',
    description: 'Heading text for a selectable box that displays related skills for a corresponding selected job title.',
  },
  relatedSkillsSelectableBoxLabelText: {
    id: 'related.skills.selectable.box.label.text',
    defaultMessage: 'Related skills:',
    description: 'Label text for a selectable box that displays related skills for a corresponding selected job title.',
  },
});

export default messages;
