import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  matchesFoundSuccessAlert: {
    id: 'matches.found.success.alert',
    defaultMessage: 'We found skills and courses that match your preferences!',
    description: 'Success alert message to display when recommendations are presented to the learner.',
  },
  matchesNotFoundDangerAlert: {
    id: 'matches.not.found.danger.alert',
    defaultMessage: 'We were not able to retrieve recommendations at this time. Please try again later.',
    description: 'Danger alert message to display when the component fails to get recommendations.',
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
  productRecommendationsHeaderText: {
    id: 'product.recommendations.header.text',
    defaultMessage: '{productType} recommendations for {jobName}',
    description: 'Header text for a carousel of product recommendations.',
  },
});

export default messages;
