import React, { useContext } from 'react';
import {
  Form,
  Stack,
} from '@edx/paragon';
import { FormattedMessage, useIntl } from '@edx/frontend-platform/i18n';
import { setGoal } from '../../data/actions';
import { SkillsBuilderContext } from '../../skills-builder-context';
import messages from './messages';

const GoalDropdown = () => {
  const intl = useIntl();
  const { state, dispatch } = useContext(SkillsBuilderContext);
  const { currentGoal } = state;

  return (
    <Stack gap={2}>
      <h4><FormattedMessage {...messages.learningGoalPrompt} /></h4>
      <Form.Group>
        <Form.Control
          as="select"
          value={currentGoal}
          onChange={(e) => dispatch(setGoal(e.target.value))}
          data-testid="goal-select-dropdown"
        >
          <option value="">{intl.formatMessage(messages.selectLearningGoal)}</option>
          <option>{intl.formatMessage(messages.learningGoalStartCareer)}</option>
          <option>{intl.formatMessage(messages.learningGoalAdvanceCareer)}</option>
          <option>{intl.formatMessage(messages.learningGoalChangeCareer)}</option>
          <option>{intl.formatMessage(messages.learningGoalSomethingNew)}</option>
          <option>{intl.formatMessage(messages.learningGoalSomethingElse)}</option>
        </Form.Control>
      </Form.Group>
    </Stack>

  );
};

export default GoalDropdown;
