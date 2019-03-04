import { mapSaveProfileRequestData, camelCaseObject } from './ProfileApiService';

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

describe('camelCaseObject', () => {
  it('should work', () => {
    const result = camelCaseObject({
      snake_case: { keys_are: 'annoying' },
      undefined_value: undefined,
      null_value: null,
      number_value: 123,
      boolean_value: true,
      array_value: ['what_ever', 234, false, {}],
    });

    expect(result).toEqual({
      snakeCase: { keysAre: 'annoying' },
      undefinedValue: undefined,
      nullValue: null,
      numberValue: 123,
      booleanValue: true,
      arrayValue: ['what_ever', 234, false, {}],
    });
  });
});
