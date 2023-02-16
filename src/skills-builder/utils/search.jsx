/*
Algolia utility functions used by the Skills Builder feature.
*/
import { useMemo } from 'react';
import { getConfig } from '@edx/frontend-platform';
import { logError } from '@edx/frontend-platform/logging';

import algoliasearch from 'algoliasearch';

/*
 * Utility function to create and return an Algolia client, as well as Index objects for our product and job data.
 *
 * @return {SearchClient} searchClient - An instantiated Algolia client
 * @return {SearchIndex} productSearchIndex - An Algolia index of product data. Used to retrieve product
 *  recommendations for learners
 * @return {SearchIndex} jobSearchIndex - An Algolia index of job taxonomy data. Used to retrieve job metadata that a
 *  learner is interested in.
 */
// eslint-disable-next-line import/prefer-default-export
export const useAlgoliaSearch = () => {
  const config = getConfig();

  const [searchClient, productSearchIndex, jobSearchIndex] = useMemo(
    () => {
      const client = algoliasearch(
        config.ALGOLIA_APP_ID,
        config.ALGOLIA_SEARCH_API_KEY,
      );
      const productIndex = client.initIndex(config.ALGOLIA_PRODUCT_INDEX_NAME);
      const jobIndex = client.initIndex(config.ALGOLIA_JOBS_INDEX_NAME);
      return [client, productIndex, jobIndex];
    },
    [
      config.ALGOLIA_APP_ID,
      config.ALGOLIA_PRODUCT_INDEX_NAME,
      config.ALGOLIA_JOBS_INDEX_NAME,
      config.ALGOLIA_SEARCH_API_KEY,
    ],
  );
  return [searchClient, productSearchIndex, jobSearchIndex];
};

/*
 * Utility function used to reformat incoming job names to match the syntax Algolia expects when querying index data.
 *
 * @param {Array[String]} jobNames - A list of job names a learner is interested in
 *
 * @return formattedJobNames - The transformed array of job names
 */
export function formatJobNames(jobNames) {
  const formattedJobNames = [];
  if (jobNames) {
    jobNames.forEach(job => formattedJobNames.push(`name:${job}`));
  }
  return formattedJobNames;
}

/*
 * Utility function responsible for querying and returning job information based on input received from a learner.
 *
 * @param {SearchIndex} jobIndex - An Algolia index of job taxonomy data. Used to retrieve job metadata that a
 *  learner is interested in.
 * @param {Array[String]} jobNames - A list of job names a learner is interested in
 *
 * @return Job information retrieved from Algolia
 */
export const searchJobs = async (jobSearchIndex, jobNames) => {
  let results = null;

  const formattedJobNames = formatJobNames(jobNames);
  try {
    const { hits } = await jobSearchIndex.search('', {
      facetFilters: [
        formattedJobNames,
      ],
    });
    results = hits;
  } catch (error) {
    logError(error);
    results = [];
  }

  return results;
};
