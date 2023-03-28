import {
  formatFacetFilterData,
  getProductRecommendations,
  searchJobs,
} from '../search';

jest.mock('@edx/frontend-platform/logging');

const mockAlgoliaResult = {
  hits: [
    {
      key: 'test-course-key',
      title: 'Test Title',
      skill_names: [
        {
          id: 1,
          name: 'Skill Name',
        },
      ],
    },
  ],
};

const mockIndex = {
  search: jest.fn().mockImplementation(() => mockAlgoliaResult),
};

describe('Algolias utility function', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('formatFacetFilterData() should return a new array with data formatted as expected', () => {
    const result = formatFacetFilterData('name', ['Organic Farmer']);
    expect(result).toEqual(['name:Organic Farmer']);
  });

  it('searchJobs() queries Algolia with the expected search parameters', async () => {
    const expectedSearchParameters = {
      facetFilters: [
        ['name:Enchanter'],
      ],
    };

    const results = await searchJobs(mockIndex, ['Enchanter']);
    expect(mockIndex.search).toHaveBeenCalledTimes(1);
    expect(mockIndex.search).toHaveBeenCalledWith('', expectedSearchParameters);
    expect(results).toEqual(mockAlgoliaResult.hits);
  });

  it('searchJobs() returns an empty array when an exception occurs querying Algolia', async () => {
    const results = await searchJobs(null, ['Organic Farmer']);
    expect(results).toEqual([]);
  });

  it('getProductRecommendations() queries Algolia with the expected search parameters', async () => {
    const expectedSearchParameters = {
      filters: 'product:Course',
      facetFilters: [
        ['skills.skill:Sword Lobbing'],
      ],
    };

    const results = await getProductRecommendations(mockIndex, 'Course', ['Sword Lobbing']);
    expect(mockIndex.search).toHaveBeenCalledTimes(1);
    expect(mockIndex.search).toHaveBeenCalledWith('', expectedSearchParameters);
    expect(results).toEqual(mockAlgoliaResult.hits);
  });

  it('getProductRecommendations() returns an empty array when an exception occurs querying Algolia', async () => {
    const results = await getProductRecommendations(null, 'Course', ['Management']);
    expect(results).toEqual([]);
  });
});
