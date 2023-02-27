import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  skillsBuilderDescription: {
    id: 'skills.builder.description',
    defaultMessage: 'Find the right courses and programs that help you reach your goals.',
    description: 'Description of what the Skills Builder seeks to accomplish',
  },
  learningGoalPrompt: {
    id: 'learning.goal.prompt',
    defaultMessage: 'First, tell us what you want to achieve',
    description: 'Prompts the user to select their current goal.',
  },
  selectLearningGoal: {
    id: 'select.learning.goal',
    defaultMessage: 'Select a goal',
    description: 'Placeholder text for the goal selection component.',
  },
  learningGoalStartCareer: {
    id: 'learning.goal.start_career',
    defaultMessage: 'I want to start my career',
    description: 'Selected by user if their goal is to start their career.',
  },
  learningGoalAdvanceCareer: {
    id: 'learning.goal.advance_career',
    defaultMessage: 'I want to advance my career',
    description: 'Selected by user if their goal is to advance their career.',
  },
  learningGoalChangeCareer: {
    id: 'learning.goal.change_career',
    defaultMessage: 'I want to change careers',
    description: 'Selected by user if their goal is to change careers.',
  },
  learningGoalSomethingNew: {
    id: 'learning.goal.something.new',
    defaultMessage: 'I want to learn something new',
    description: 'Selected by user if their goal is to learn something new.',
  },
  learningGoalSomethingElse: {
    id: 'learning.goal.something.else',
    defaultMessage: 'Something else',
    description: 'Selected by user if their goal is not described by the other choices.',
  },
  jobTitlePrompt: {
    id: 'job.title.prompt',
    defaultMessage: 'Next, search and select your current job title',
    description: 'Prompts the user to select their current job title or occupation.',
  },
  studentCheckboxPrompt: {
    id: 'student.checkbox.prompt',
    defaultMessage: 'I\'m a student',
    description: 'Label text for the corresponding checkbox',
  },
  currentlyLookingCheckboxPrompt: {
    id: 'currently.looking.checkbox.prompt',
    defaultMessage: 'I\'m currently looking for work',
    description: 'Label text for the corresponding checkbox',
  },
  careerInterestPrompt: {
    id: 'career.interest.prompt',
    defaultMessage: 'What careers are you interested in?',
    description: 'Prompts the user to select careers they are interested in pursuing.',
  },
});

export default messages;
