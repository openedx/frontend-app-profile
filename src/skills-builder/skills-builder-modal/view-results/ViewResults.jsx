import React, {
  useContext, useEffect, useState,
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
      setSelectedJobTitle(results[0].name);
      setProductRecommendations(results);
      setIsLoading(false);
      sendTrackEvent('edx.skills_builder.recommendation.shown', {
        app_name: 'skills_builder',
        category: 'skills_builder',
        page: 'skills_builder',
        selected_recommendations: {
          job_id: results[0].id,
          job_name: results[0].name,
          /* We extract the title and course key into an array of objects */
          courserun_keys: results[0].recommendations.course?.map(rec => ({
            title: rec.title,
            courserun_key: rec.active_run_key,
          })),
        },
        is_default: true,
      });
    };
    getRecommendations()
      .catch(() => {
        setFetchError(true);
        setIsLoading(false);
      });
  }, [careerInterests, jobSearchIndex, productSearchIndex]);

  useEffect(() => {
    setSelectedRecommendations(productRecommendations.find(rec => rec.name === selectedJobTitle));
  }, [productRecommendations, selectedJobTitle]);

  const handleJobTitleChange = (e) => {
    const { value } = e.target;
    setSelectedJobTitle(value);
    const currentSelection = productRecommendations.find(rec => rec.name === value);
    const { id: jobId, name: jobName, recommendations } = currentSelection;
    const courseKeys = recommendations.course?.map(rec => ({
      title: rec.title,
      courserun_key: rec.active_run_key,
    }));
    /*
      The is_default value will be set to false for any selections made by the user.
      This code is intentionally duplicated from the event that fires in the useEffect for fetching recommendations.
      This proved less clunky than refactoring to make things DRY as we have to ensure the first call fires only once.
      The previous implementation wrapped the event in an additional useEffect that was looping unnecessarily.
      We have plans to refactor all of the event code as part of APER-2392, where we will revisit this approach.
    */
    sendTrackEvent('edx.skills_builder.recommendation.shown', {
      app_name: 'skills_builder',
      category: 'skills_builder',
      page: 'skills_builder',
      selected_recommendations: {
        job_id: jobId,
        job_name: jobName,
        courserun_keys: courseKeys,
      },
      is_default: false,
    });
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
