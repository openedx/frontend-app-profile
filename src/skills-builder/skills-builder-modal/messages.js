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
});

export default messages;
