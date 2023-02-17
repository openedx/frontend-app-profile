import React, { useContext } from 'react';
import {
  Stack,
} from '@edx/paragon';
import { FormattedMessage } from '@edx/frontend-platform/i18n';
import { SkillsBuilderContext } from '../../skills-builder-context';

import GoalSelect from './GoalSelect';
import JobTitleSelect from './JobTitleSelect';
import CareerInterestSelect from './CareerInterestSelect';
import messages from './messages';

const SelectPreferences = () => {
  const { state } = useContext(SkillsBuilderContext);
  const { currentGoal, currentJobTitle } = state;

  return (
    <Stack gap={5}>
      <p className="lead">
        <FormattedMessage {...messages.skillsBuilderDescription} />
      </p>

      <GoalSelect />

      {currentGoal && (
        <JobTitleSelect />
      )}

      {currentJobTitle && (
        <CareerInterestSelect />
      )}
    </Stack>
  );
};

export default SelectPreferences;
