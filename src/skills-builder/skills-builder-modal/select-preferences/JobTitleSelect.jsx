import React, { useContext } from 'react';
import {
  Form, Stack,
} from '@edx/paragon';
import { getConfig } from '@edx/frontend-platform';
import { FormattedMessage } from '@edx/frontend-platform/i18n';
import { InstantSearch } from 'react-instantsearch-hooks-web';
import { setCurrentJobTitle } from '../../data/actions';
import { SkillsBuilderContext } from '../../skills-builder-context';
import JobTitleInstantSearch from './JobTitleInstantSearch';
import messages from './messages';

const JobTitleSelect = () => {
  const { dispatch, algolia } = useContext(SkillsBuilderContext);
  const { searchClient } = algolia;

  // Below implementation sets the job title to "student" or "looking_for_work" — this overwrites any previous selection
  // This will need to be revisited when we decide what to do with this data
  const handleCheckboxChange = (e) => dispatch(setCurrentJobTitle(e.target.value));

  return (
    <Stack gap={2}>
      <h4>
        <FormattedMessage {...messages.jobTitlePrompt} />
      </h4>
      <InstantSearch searchClient={searchClient} indexName={getConfig().ALGOLIA_JOBS_INDEX_NAME}>
        <JobTitleInstantSearch onSelected={(value) => dispatch(setCurrentJobTitle(value))} />
      </InstantSearch>
      <Form.Group>
        <Form.CheckboxSet
          name="other-occupations"
          onChange={handleCheckboxChange}
        >
          <Form.Checkbox value="student">
            <FormattedMessage {...messages.studentCheckboxPrompt} />
          </Form.Checkbox>
          <Form.Checkbox value="looking_for_work">
            <FormattedMessage {...messages.currentlyLookingCheckboxPrompt} />
          </Form.Checkbox>
        </Form.CheckboxSet>
      </Form.Group>
    </Stack>
  );
};

export default JobTitleSelect;
