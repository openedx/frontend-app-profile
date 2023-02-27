import React, { useContext } from 'react';
import {
  Stack,
} from '@edx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';
import { SkillsBuilderContext } from '../../skills-builder-context';
import GoalSelect from './GoalSelect';
import JobTitleSelect from './JobTitleSelect';
import CareerInterestSelect from './CareerInterestSelect';
import messages from './messages';

const SelectPreferences = () => {
  const { formatMessage } = useIntl();
  const { state } = useContext(SkillsBuilderContext);
  const { currentGoal, currentJobTitle } = state;

  return (
    <Stack gap={4}>
      <p className="lead">
        {formatMessage(messages.skillsBuilderDescription)}
      </p>
      <Stack gap={4}>

        <GoalSelect />

        {currentGoal && (
          <JobTitleSelect />
        )}

        {currentJobTitle && (
          <CareerInterestSelect />
        )}
      </Stack>
    </Stack>
  );
};

export default SelectPreferences;
