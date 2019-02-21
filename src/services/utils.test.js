import { flattenAndTransformKeys, unflattenAndTransformKeys } from './utils';


describe('unflattenAndTransformKeys', () => {
  it('should unflatten objects and transform keys', () => {
    const sourceObject = {
      userlocation: 'US',
      'visibility.sociallinks': 'private',
      'visibility.education': 'private',
      'visibility.bio': 'private',
    };

    const result = unflattenAndTransformKeys(sourceObject, key => key.toUpperCase());

    expect(result).toEqual({
      USERLOCATION: 'US',
      VISIBILITY: {
        SOCIALLINKS: 'private',
        EDUCATION: 'private',
        BIO: 'private',
      },
    });
  });
});


describe('flattenAndTransformKeys', () => {
  it('should flatten objects and transform keys', () => {
    const sourceObject = {
      USERLOCATION: 'US',
      VISIBILITY: {
        SOCIALLINKS: 'private',
        EDUCATION: 'private',
        BIO: 'private',
      },
    };

    const result = flattenAndTransformKeys(sourceObject, key => key.toLowerCase());

    expect(result).toEqual({
      userlocation: 'US',
      'visibility.sociallinks': 'private',
      'visibility.education': 'private',
      'visibility.bio': 'private',
    });
  });
});
