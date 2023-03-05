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
    <>
      <p className="lead mb-5">
        <FormattedMessage {...messages.skillsBuilderDescription} />
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
    </>
  );
};

export default SelectPreferences;
