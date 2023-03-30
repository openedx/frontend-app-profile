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
      owners: [
        {
          logoImageUrl: 'https://thisIsAUrl.ForALogoImage.02.jpeg',
        }
      ]
    },
  ],
  useAlgoliaSearch: [{}, {}, {}],
};
