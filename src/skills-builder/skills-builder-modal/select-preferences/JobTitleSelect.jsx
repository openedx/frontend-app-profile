import React, { useContext } from 'react';
import { getConfig } from '@edx/frontend-platform';
import {
  Form, Stack,
} from '@edx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import { InstantSearch } from 'react-instantsearch-hooks-web';
import { setCurrentJobTitle } from '../../data/actions';
import { SkillsBuilderContext } from '../../skills-builder-context';
import JobTitleInstantSearch from './JobTitleInstantSearch';
import messages from './messages';

const JobTitleSelect = () => {
  const { formatMessage } = useIntl();
  const { state, dispatch, algolia } = useContext(SkillsBuilderContext);
  const { searchClient } = algolia;
  const { currentJobTitle } = state;

  const handleCurrentJobTitleSelect = (value) => {
    dispatch(setCurrentJobTitle(value));
    sendTrackEvent(
      'edx.skills_builder.current_job.select',
      {
        app_name: 'skills_builder',
        category: 'skills_builder',
        learner_data: {
          current_job_title: value,
        },
      },
    );
  };

  const handleCheckboxChange = (e) => {
    const { value } = e.target;
    // only setCurrentJobTitle if the user hasn't selected a current job as we don't want to override their selection
    if (!currentJobTitle) { dispatch(setCurrentJobTitle(value)); }

    sendTrackEvent(
      `edx.skills_builder.current_job.${value}`,
      {
        app_name: 'skills_builder',
        category: 'skills_builder',
      },
    );
  };

  return (
    <Stack>
      <Form.Label>
        <h4 className="mb-3">
          {formatMessage(messages.jobTitlePrompt)}
        </h4>
        <InstantSearch searchClient={searchClient} indexName={getConfig().ALGOLIA_JOBS_INDEX_NAME}>
          <JobTitleInstantSearch
            onSelected={handleCurrentJobTitleSelect}
            placeholder={formatMessage(messages.jobTitleInputPlaceholderText)}
            data-testid="job-title-select"
          />
        </InstantSearch>
      </Form.Label>
      <Form.Group>
        <Form.CheckboxSet
          name="other-occupations"
          onChange={handleCheckboxChange}
        >
          <Form.Checkbox value="student">
            {formatMessage(messages.studentCheckboxPrompt)}
          </Form.Checkbox>
          <Form.Checkbox value="looking_for_work">
            {formatMessage(messages.currentlyLookingCheckboxPrompt)}
          </Form.Checkbox>
        </Form.CheckboxSet>
      </Form.Group>
    </Stack>
  );
};

export default JobTitleSelect;
