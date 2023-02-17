import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Form,
} from '@edx/paragon';
import { useHits, useSearchBox } from 'react-instantsearch-hooks-web';

const JobTitleInstantSearch = (props) => {
  const { refine } = useSearchBox(props);
  const { hits } = useHits(props);

  const [jobInput, setJobInput] = useState('');

  const handleAutosuggestChange = (value) => {
    setJobInput(value);
    refine(value);
  };

  return (
    <Form.Autosuggest
      value={jobInput}
      onChange={handleAutosuggestChange}
      name="job-title-suggest"
      onSelected={props.onSelected}
    >
      {hits.map(job => (
        <Form.AutosuggestOption key={job.id}>
          {job.name}
        </Form.AutosuggestOption>
      ))}
    </Form.Autosuggest>
  );
};

JobTitleInstantSearch.propTypes = {
  onSelected: PropTypes.func.isRequired,
};

export default JobTitleInstantSearch;
