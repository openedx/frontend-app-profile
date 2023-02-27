export const mockData = {
  hits: [
    {
      id: 0,
      name: 'Text File Engineer'
    },
    {
      id: 1,
      name: 'Screen Viewer'
    },
  ],
  searchJobs: [
    {
      id: 0,
      name: 'Prospector',
      skills: [
        { id: 0, 
          name: 'mining',
          significance: 50,
        }, 
        { id: 1,
          name: 'finding shiny things',
          significance: 100,
        }],
    },
  ],
  productRecommendations: [
    {
      id: 0,
      name: 'Prospector',
      recommendations: [{ name: 'Mining with the Mons' }, { name: 'The Art of Warren Upkeep' }],
    },
    {
      id: 1,
      name: 'Mirror Breaker',
      recommendations: [{ name: 'Mirror Breaking 101' }],
    },
  ],
  useAlgoliaSearch: [{}, {}, {}],
};
