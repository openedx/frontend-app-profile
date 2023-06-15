/* eslint-disable import/prefer-default-export */
import { searchJobs, getProductRecommendations } from '../../../utils/search';

export async function getRecommendations(jobSearchIndex, productSearchIndex, careerInterests, productTypes) {
  const jobInfo = await searchJobs(jobSearchIndex, careerInterests);

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
      const formattedProductType = productType.replace('_', ' ');
      const response = await getProductRecommendations(productSearchIndex, formattedProductType, formattedSkills);

      // add a new key to the recommendations object and set the value to the response
      data.recommendations[productType] = response;
    }));

    return data;
  }));

  return {
    jobInfo,
    results,
  };
}
