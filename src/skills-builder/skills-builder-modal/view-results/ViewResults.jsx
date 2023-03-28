import React, { useContext, useEffect, useState } from 'react';
import {
  Stack, Row, Alert, Spinner,
} from '@edx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';
import { CheckCircle } from '@edx/paragon/icons';
import { SkillsBuilderContext } from '../../skills-builder-context';
import RelatedSkillsSelectableBoxSet from './RelatedSkillsSelectableBoxSet';
import { searchJobs, getProductRecommendations } from '../../utils/search';
import messages from './messages';

const ViewResults = () => {
  const { formatMessage } = useIntl();
  const { algolia, state } = useContext(SkillsBuilderContext);
  const { jobSearchIndex, productSearchIndex } = algolia;
  const { careerInterests } = state;

  const [selectedJobTitle, setSelectedJobTitle] = useState('');
  const [jobSkillsList, setJobSkillsList] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [courseRecommendations, setCourseRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getJobs = async () => {
      // fetch list of jobs with related skills
      const jobInfo = await searchJobs(jobSearchIndex, careerInterests);

      // fetch course recommendations based on related skills for each job
      const results = await Promise.all(jobInfo.map(async (job) => {
        const formattedSkills = job.skills.map(skill => skill.name);

        const recommendations = await getProductRecommendations(productSearchIndex, 'course', formattedSkills);

        const data = {
          id: job.id,
          name: job.name,
          recommendations,
        };

        return data;
      }));

      setJobSkillsList(jobInfo);
      setSelectedJobTitle(jobInfo[0].name);
      setCourseRecommendations(results);
      setIsLoading(false);
    };
    getJobs();
  }, [careerInterests, jobSearchIndex, productSearchIndex]);

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
      <Stack gap={4.5}>
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
          onChange={(e) => setSelectedJobTitle(e.target.value)}
        />
      </Stack>
    )
  );
};

export default ViewResults;
