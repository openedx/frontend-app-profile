import { formatJobNames, searchJobs } from '../search';

jest.mock('@edx/frontend-platform/logging');

describe('Algolias utility function', () => {
  it('formatJobNames() should return a new array with data formatted as expected', () => {
    const jobNameArray = ['Organic Farmer'];
    const result = formatJobNames(jobNameArray);
    expect(result).toEqual(['name:Organic Farmer']);
  });

  it('searchJobs() returns an empty array when an exception occurs querying Algolia', async () => {
    const results = await searchJobs(null, ['name:Organic Farmer']);
    expect(results).toEqual([]);
  });
});
