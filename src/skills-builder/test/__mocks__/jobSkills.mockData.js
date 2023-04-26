export const mockData = {
  hits: [
    {
      id: 0,
      name: 'Prospector'
    },
    {
      id: 1,
      name: 'Mirror Breaker'
    },
  ],
  searchJobs: [
    {
      id: 0,
      name: 'Prospector',
      skills: [
        { external_id: 0,
          name: 'mining',
          significance: 50,
        },
        { external_id: 1,
          name: 'finding shiny things',
          significance: 100,
        }],
    },
    {
      id: 1,
      name: 'Mirror Breaker',
      skills: [
        { external_id: 0,
          name: 'mining',
          significance: 50,
        }, 
        { external_id: 1,
          name: 'finding shiny things',
          significance: 100,
        }],
    },
  ],
  productRecommendations: [
    {
      title: 'Mining with the Mons',
      uuid: 'thisIsARandomString01',
      partner: ['edx'],
      card_image_url: 'https://thisIsAUrl.ForAnImage.01.jpeg',
      marketing_url: 'https://thisIsAUrl.ForTheRecommendedContent.01.com',
      active_run_key: 'MONS101',
      owners: [
        {
          logoImageUrl: 'https://thisIsAUrl.ForALogoImage.01.jpeg',
        }
      ]
    },
    {
      title: 'The Art of Warren Upkeep',
      uuid: 'thisIsARandomString02',
      partner: ['edx'],
      card_image_url: 'https://thisIsAUrl.ForAnImage.02.jpeg',
      marketing_url: 'https://thisIsAUrl.ForTheRecommendedContent.02.com',
      active_run_key: 'WAR101',
      owners: [
        {
          logoImageUrl: 'https://thisIsAUrl.ForALogoImage.02.jpeg',
        }
      ]
    },
  ],
  useAlgoliaSearch: [{}, {}, {}],
};
