import React, { useContext } from 'react';
import {
  Form,
} from '@edx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import { setGoal } from '../../data/actions';
import { SkillsBuilderContext } from '../../skills-builder-context';
import messages from './messages';

const GoalDropdown = () => {
  const { formatMessage } = useIntl();
  const { state, dispatch } = useContext(SkillsBuilderContext);
  const { currentGoal } = state;

  const handleGoalSelect = (e) => {
    const { value } = e.target;
    dispatch(setGoal(value));

    sendTrackEvent(
      'edx.skills_builder.goal.select',
      {
        app_name: 'skills_builder',
        category: 'skills_builder',
        learner_data: {
          current_goal: value,
        },
      },
    );
  };

  return (
    <Form.Group>
      <Form.Label>
        <h4>
          {formatMessage(messages.learningGoalPrompt)}
        </h4>
      </Form.Label>
      <Form.Control
        as="select"
        value={currentGoal}
        onChange={handleGoalSelect}
        data-testid="goal-select-dropdown"
      >
        <option value="">{formatMessage(messages.selectLearningGoal)}</option>
        <option>{formatMessage(messages.learningGoalStartCareer)}</option>
        <option>{formatMessage(messages.learningGoalAdvanceCareer)}</option>
        <option>{formatMessage(messages.learningGoalChangeCareer)}</option>
        <option>{formatMessage(messages.learningGoalSomethingNew)}</option>
        <option>{formatMessage(messages.learningGoalSomethingElse)}</option>
      </Form.Control>
    </Form.Group>
  );
};

export default GoalDropdown;
