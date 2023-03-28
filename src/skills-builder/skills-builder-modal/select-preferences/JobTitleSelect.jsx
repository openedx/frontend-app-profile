import React, { useContext } from 'react';
import { getConfig } from '@edx/frontend-platform';
import {
  Form, Stack,
} from '@edx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';
import { InstantSearch } from 'react-instantsearch-hooks-web';
import { setCurrentJobTitle } from '../../data/actions';
import { SkillsBuilderContext } from '../../skills-builder-context';
import JobTitleInstantSearch from './JobTitleInstantSearch';
import messages from './messages';

const JobTitleSelect = () => {
  const { formatMessage } = useIntl();
  const { dispatch, algolia } = useContext(SkillsBuilderContext);
  const { searchClient } = algolia;

  const handleCurrentJobTitleSelect = (value) => {
    dispatch(setCurrentJobTitle(value));
  };

  // Below implementation sets the job title to "Student" or "Looking for work" — this overwrites any previous selection
  // This will need to be revisited when we decide what to do with this data
  const handleCheckboxChange = (e) => dispatch(setCurrentJobTitle(e.target.value));

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
          />
        </InstantSearch>
      </Form.Label>
      <Form.Group>
        <Form.CheckboxSet
          name="other-occupations"
          onChange={handleCheckboxChange}
        >
          <Form.Checkbox value="Student">
            {formatMessage(messages.studentCheckboxPrompt)}
          </Form.Checkbox>
          <Form.Checkbox value="Looking for work">
            {formatMessage(messages.currentlyLookingCheckboxPrompt)}
          </Form.Checkbox>
        </Form.CheckboxSet>
      </Form.Group>
    </Stack>
  );
};

export default JobTitleSelect;
