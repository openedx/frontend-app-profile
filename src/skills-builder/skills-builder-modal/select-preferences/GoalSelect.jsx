import React, { useContext } from 'react';
import {
  Form,
  Stack,
} from '@edx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';
import { setGoal } from '../../data/actions';
import { SkillsBuilderContext } from '../../skills-builder-context';
import messages from './messages';

const GoalDropdown = () => {
  const { formatMessage } = useIntl();
  const { state, dispatch } = useContext(SkillsBuilderContext);
  const { currentGoal } = state;

  return (
    <Stack gap={2}>
      <h4>
        {formatMessage(messages.learningGoalPrompt)}
      </h4>
      <Form.Group>
        <Form.Control
          as="select"
          value={currentGoal}
          onChange={(e) => dispatch(setGoal(e.target.value))}
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
    </Stack>

  );
};

export default GoalDropdown;
