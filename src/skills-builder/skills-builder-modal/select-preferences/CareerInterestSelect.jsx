import React, { useContext } from 'react';
import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Stack, Row, Col } from '@edx/paragon';
import { InstantSearch } from 'react-instantsearch-hooks-web';
import JobTitleInstantSearch from './JobTitleInstantSearch';
import CareerInterestCard from './CareerInterestCard';
import { addCareerInterest } from '../../data/actions';
import { SkillsBuilderContext } from '../../skills-builder-context';
import messages from './messages';

const CareerInterestSelect = () => {
  const { formatMessage } = useIntl();
  const { state, dispatch, algolia } = useContext(SkillsBuilderContext);
  const { careerInterests } = state;
  const { searchClient } = algolia;

  const handleCareerInterestSelect = (value) => {
  // By checking for a value to exist, we avoid adding a null value to the careerInterests array
  // The 'onSelected' function is fired during every 'onChange' event
  // A null value was being passed to this function whenever the search box received input, resulting in empty cards
    if (value && careerInterests.length < 3) {
      dispatch(addCareerInterest(value));
    }
  };

  return (
    <Stack gap={2}>
      <h4>
        {formatMessage(messages.careerInterestPrompt)}
      </h4>
      <InstantSearch searchClient={searchClient} indexName={getConfig().ALGOLIA_JOBS_INDEX_NAME}>
        <JobTitleInstantSearch
          onSelected={handleCareerInterestSelect}
          placeholder={formatMessage(messages.careerInterestInputPlaceholder)}
        />
      </InstantSearch>
      <Row>
        {careerInterests.map((interest, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Col key={index} xs={12} sm={4} className="mb-4">
            <CareerInterestCard interest={interest} />
          </Col>
        ))}
      </Row>
    </Stack>
  );
};

export default CareerInterestSelect;
