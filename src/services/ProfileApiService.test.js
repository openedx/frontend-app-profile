import { mapSaveProfileRequestData } from './ProfileApiService';

describe('mapSaveProfileRequestData', () => {
  it('should modify props according to prop modifier strings and functions', () => {
    const props = {
      favoriteColor: 'red',
      age: 30,
      petName: 'Donkey',
      name: 'Donkey McWafflebatter',
      country: 'US',
      education: 'BS',
      socialLinks: {
        twitter: null,
        facebook: 'https://www.facebook.com',
      },
    };
    const result = mapSaveProfileRequestData(props);
    expect(result).toEqual({
      favoriteColor: 'red',
      age: 30,
      petName: 'Donkey',
      name: 'Donkey McWafflebatter',
      country: 'US',
      levelOfEducation: 'BS',
      socialLinks: [
        {
          platform: 'facebook',
          socialLink: 'https://www.facebook.com',
        },
      ],
    });
  });
});
