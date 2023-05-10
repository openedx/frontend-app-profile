import React, { useContext } from 'react';
import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import {
  Stack, Row, Col, Form,
} from '@edx/paragon';
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
    if (!careerInterests.includes(value) && careerInterests.length < 3) {
      dispatch(addCareerInterest(value));

      sendTrackEvent(
        'edx.skills_builder.career_interest.added',
        {
          app_name: 'skills_builder',
          category: 'skills_builder',
          learner_data: {
            career_interest: value,
          },
        },
      );
    }
  };

  return (
    <Stack gap={2}>
      <Form.Label>
        <h4 className="mb-3">
          {formatMessage(messages.careerInterestPrompt)}
        </h4>
        <InstantSearch searchClient={searchClient} indexName={getConfig().ALGOLIA_JOBS_INDEX_NAME}>
          <JobTitleInstantSearch
            onSelected={handleCareerInterestSelect}
            placeholder={formatMessage(messages.careerInterestInputPlaceholderText)}
            data-testid="career-interest-select"
          />
        </InstantSearch>
      </Form.Label>
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
