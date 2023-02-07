import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  'profile.learningGoal.learningGoal': {
    id: 'profile.learningGoal.learningGoal',
    defaultMessage: 'Learning Goal',
    description: 'A section of a user profile that displays their current learning goal.',
  },
  'profile.learningGoal.options.start_career': {
    id: 'profile.learningGoal.options.start_career',
    defaultMessage: 'I want to start my career',
    description: 'Selected by user if their goal is to start their career.',
  },
  'profile.learningGoal.options.advance_career': {
    id: 'profile.learningGoal.options.advance_career',
    defaultMessage: 'I want to advance my career',
    description: 'Selected by user if their goal is to advance their career.',
  },
  'profile.learningGoal.options.learn_something_new': {
    id: 'profile.learningGoal.options.learn_something_new',
    defaultMessage: 'I want to learn something new',
    description: 'Selected by user if their goal is to learn something new.',
  },
  'profile.learningGoal.options.something_else': {
    id: 'profile.learningGoal.options.something_else',
    defaultMessage: 'Something else',
    description: 'Selected by user if their goal is not described by the other choices.',
  },
});

export default messages;
