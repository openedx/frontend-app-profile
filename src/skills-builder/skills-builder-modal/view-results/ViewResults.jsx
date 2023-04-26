import React, {
  useCallback, useContext, useEffect, useState,
} from 'react';
import {
  Stack, Row, Alert, Spinner,
} from '@edx/paragon';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import { useIntl } from '@edx/frontend-platform/i18n';
import { CheckCircle, ErrorOutline } from '@edx/paragon/icons';
import { SkillsBuilderContext } from '../../skills-builder-context';
import RelatedSkillsSelectableBoxSet from './RelatedSkillsSelectableBoxSet';
import { searchJobs, getProductRecommendations } from '../../utils/search';
import messages from './messages';
import { productTypes } from './data/constants';
import CarouselStack from './CarouselStack';

const ViewResults = () => {
  const { formatMessage } = useIntl();
  const { algolia, state } = useContext(SkillsBuilderContext);
  const { jobSearchIndex, productSearchIndex } = algolia;
  const { careerInterests } = state;

  const [selectedJobTitle, setSelectedJobTitle] = useState('');
  const [jobSkillsList, setJobSkillsList] = useState([]);
  const [productRecommendations, setProductRecommendations] = useState([]);
  const [selectedRecommendations, setSelectedRecommendations] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    const getRecommendations = async () => {
      // fetch list of jobs with related skills
      const jobInfo = await searchJobs(jobSearchIndex, careerInterests);

      // fetch course recommendations based on related skills for each job
      const results = await Promise.all(jobInfo.map(async (job) => {
        const formattedSkills = job.skills.map(skill => skill.name);

        // create a data object for each job
        const data = {
          id: job.id,
          name: job.name,
          recommendations: {},
        };

        // get recommendations for each product type based on the skills for the current job
        await Promise.all(productTypes.map(async (productType) => {
          const response = await getProductRecommendations(productSearchIndex, productType, formattedSkills);

          // replace all white spaces with an underscore
          const formattedProductType = productType.replace(' ', '_');

          // add a new key to the recommendations object and set the value to the response
          data.recommendations[formattedProductType] = response;
        }));

        return data;
      }));

      setJobSkillsList(jobInfo);
      setSelectedJobTitle(jobInfo[0].name);
      setProductRecommendations(results);
      setIsLoading(false);
    };
    getRecommendations()
      .catch(() => {
        setFetchError(true);
        setIsLoading(false);
      });
  }, [careerInterests, jobSearchIndex, productSearchIndex]);

  const sendRecommendationShownEvent = useCallback((selectedJobName, isDefault) => {
    sendTrackEvent('edx.skills_builder.recommendation.shown', {
      app_name: 'skills_builder',
      category: 'skills_builder',
      page: 'skills_builder',
      selected_recommendations: productRecommendations.find(rec => rec.name === selectedJobName),
      is_default: isDefault,
    });
  }, [productRecommendations]);

  useEffect(() => {
    /*
      This useEffect will fire when selectedJobTitle is changed
      We initially setSelectedJobTitle when the recommendations are returned
      We are sending an event with the is_default field set to true for the initial default selection
    */
    const newlySelectedRecommendations = productRecommendations.find(rec => rec.name === selectedJobTitle);
    if (!selectedRecommendations && newlySelectedRecommendations) {
      sendRecommendationShownEvent(selectedJobTitle, true);
    }
    setSelectedRecommendations(newlySelectedRecommendations);
  }, [productRecommendations, selectedJobTitle, selectedRecommendations, sendRecommendationShownEvent]);

  const handleJobTitleChange = (e) => {
    const { value } = e.target;
    setSelectedJobTitle(value);
    // The is_default value will be set to false for any selections made by the user
    sendRecommendationShownEvent(value, false);
  };

  if (fetchError) {
    return (
      <Alert
        variant="danger"
        icon={ErrorOutline}
      >
        <Alert.Heading>
          {formatMessage(messages.matchesNotFoundDangerAlert)}
        </Alert.Heading>
      </Alert>
    );
  }

  return (
    isLoading ? (
      <Row>
        <Spinner
          animation="border"
          screenReaderText="loading"
          className="mx-auto"
        />
      </Row>
    ) : (
      <Stack gap={4.5} className="pb-4.5">
        <Alert
          variant="success"
          icon={CheckCircle}
        >
          <Alert.Heading>
            {formatMessage(messages.matchesFoundSuccessAlert)}
          </Alert.Heading>
        </Alert>

        <RelatedSkillsSelectableBoxSet
          jobSkillsList={jobSkillsList}
          selectedJobTitle={selectedJobTitle}
          onChange={handleJobTitleChange}
        />

        <CarouselStack selectedRecommendations={selectedRecommendations} />
      </Stack>
    )
  );
};

export default ViewResults;
