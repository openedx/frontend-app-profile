import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  /* Modal Action Row Buttons */
  goBackButton: {
    id: 'go.back.button',
    defaultMessage: 'Go Back',
    description: 'Button that sends the user to the previous step in the skills builder.',
  },
  nextStepButton: {
    id: 'next.step.button',
    defaultMessage: 'Next Step',
    description: 'Button that sends the user to the next step in the skills builder.',
  },
  exitButton: {
    id: 'exit.button',
    defaultMessage: 'Exit',
    description: 'Button that exits the Skills Builder.',
  },
  selectPreferences: {
    id: 'select.preferences',
    defaultMessage: 'Select preferences',
    description: 'The first step of the Skills Builder for selecting a goal, a current job/occupation, and career interests',
  },
  reviewResults: {
    id: 'review.results',
    defaultMessage: 'Review results',
    description: 'The second step of the Skills Builder for rendering results from learner input',
  },
});

export default messages;
