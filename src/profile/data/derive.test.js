import {
  getDraftSocialLinksByPlatform,
  getEditMode,
  getFormError,
  getFormSocialLinks,
  getFormValues,
  getProfileImage,
  getSortedCountries,
  getVisibilities,
  pickAccountDrafts,
  pickPreferencesDrafts,
} from '@src/profile/data/derive';

const account = {
  name: 'Lemon Seltzer',
  bio: 'This is my bio',
  country: 'ME',
  levelOfEducation: null,
  languageProficiencies: [{ code: 'yo' }],
  socialLinks: [{ platform: 'facebook', socialLink: 'https://www.facebook.com/aloha' }],
};

describe('pickAccountDrafts and pickPreferencesDrafts', () => {
  const drafts = {
    bio: 'new bio',
    visibilityBio: 'private',
    socialLinks: [],
    visibilitySocialLinks: 'all_users',
    unrelated: true,
  };

  it('splits the drafts between the two endpoints', () => {
    expect(pickAccountDrafts(drafts)).toEqual({ bio: 'new bio', socialLinks: [] });
    expect(pickPreferencesDrafts(drafts)).toEqual({
      visibilityBio: 'private',
      visibilitySocialLinks: 'all_users',
      accountPrivacy: 'custom',
    });
  });

  it('does not switch the privacy model when no visibility changed', () => {
    expect(pickPreferencesDrafts({ bio: 'new bio' })).toEqual({});
  });
});

describe('getEditMode', () => {
  const base = { account, isOwnProfile: true, currentlyEditingField: null };

  it("is static on someone else's profile, whatever else is going on", () => {
    expect(getEditMode({
      ...base, formId: 'bio', isOwnProfile: false, currentlyEditingField: 'bio',
    })).toBe('static');
  });

  it('is editing for the open form', () => {
    expect(getEditMode({ ...base, formId: 'bio', currentlyEditingField: 'bio' })).toBe('editing');
  });

  it('is editable for a field with a value and empty otherwise', () => {
    expect(getEditMode({ ...base, formId: 'bio' })).toBe('editable');
    expect(getEditMode({ ...base, formId: 'languageProficiencies' })).toBe('editable');
    expect(getEditMode({ ...base, formId: 'levelOfEducation' })).toBe('empty');
    expect(getEditMode({ ...base, formId: 'missing' })).toBe('empty');
  });
});

describe('getFormError', () => {
  it('returns the user message of the field, if any', () => {
    expect(getFormError({ bio: { userMessage: 'Too long' } }, 'bio')).toBe('Too long');
    expect(getFormError({}, 'bio')).toBeNull();
  });
});

describe('getVisibilities', () => {
  it('reads each preference under the custom model, defaulting to public', () => {
    expect(getVisibilities({ accountPrivacy: 'custom', visibilityBio: 'private' })).toEqual({
      visibilityBio: 'private',
      visibilityCountry: 'all_users',
      visibilityLevelOfEducation: 'all_users',
      visibilityLanguageProficiencies: 'all_users',
      visibilityName: 'all_users',
      visibilitySocialLinks: 'all_users',
    });
  });

  it('hides everything under the private model', () => {
    expect(Object.values(getVisibilities({ accountPrivacy: 'private', visibilityBio: 'all_users' })))
      .toEqual(Array(6).fill('private'));
  });

  it('shows everything under the legacy model and when there are no preferences', () => {
    expect(Object.values(getVisibilities({ accountPrivacy: 'all_users' }))).toEqual(Array(6).fill('all_users'));
    expect(Object.values(getVisibilities({}))).toEqual(Array(6).fill('all_users'));
    expect(Object.values(getVisibilities())).toEqual(Array(6).fill('all_users'));
  });
});

describe('getProfileImage', () => {
  it('maps the image URL and whether it is the default one', () => {
    expect(getProfileImage({ profileImage: { imageUrlFull: 'http://img/full.jpg', hasImage: true } }))
      .toEqual({ src: 'http://img/full.jpg', isDefault: false });
    expect(getProfileImage({ profileImage: { imageUrlFull: 'http://img/default.jpg', hasImage: false } }))
      .toEqual({ src: 'http://img/default.jpg', isDefault: true });
  });

  it('is empty without an account or an image', () => {
    expect(getProfileImage(undefined)).toEqual({});
    expect(getProfileImage({ profileImage: null })).toEqual({});
  });
});

describe('social links', () => {
  it('lists every known platform, drafts first, then saved links, then empty ones', () => {
    const drafts = { socialLinks: [{ platform: 'x', socialLink: 'https://x.com/aloha' }] };
    expect(getFormSocialLinks(account, drafts)).toEqual([
      { platform: 'x', socialLink: 'https://x.com/aloha' },
      { platform: 'facebook', socialLink: 'https://www.facebook.com/aloha' },
      { platform: 'linkedin', socialLink: null },
    ]);
  });

  it('indexes the drafted links by platform', () => {
    expect(getDraftSocialLinksByPlatform({})).toEqual({});
    expect(getDraftSocialLinksByPlatform({ socialLinks: [{ platform: 'x', socialLink: 'https://x.com/aloha' }] }))
      .toEqual({ x: { platform: 'x', socialLink: 'https://x.com/aloha' } });
  });
});

describe('getFormValues', () => {
  it('shows drafts over committed values and preferences', () => {
    const values = getFormValues({
      account,
      preferences: { accountPrivacy: 'custom', visibilityName: 'private' },
      drafts: { bio: 'Draft bio', visibilityName: 'all_users' },
      certificates: [{ courseId: 'x' }],
    });
    expect(values).toMatchObject({
      bio: 'Draft bio',
      name: 'Lemon Seltzer',
      visibilityName: 'all_users',
      visibilityBio: 'all_users',
      country: 'ME',
      levelOfEducation: null,
      languageProficiencies: [{ code: 'yo' }],
      courseCertificates: [{ courseId: 'x' }],
    });
    expect(values.socialLinks).toHaveLength(3);
  });
});

describe('getSortedCountries', () => {
  const countryList = [
    { code: 'CA', name: 'Canada' },
    { code: 'ME', name: 'Montenegro' },
    { code: 'RU', name: 'Russia' },
    { code: 'US', name: 'United States' },
  ];

  it('keeps the allowed countries and the one already saved', () => {
    expect(getSortedCountries(countryList, ['US', 'CA'], 'ME').map(({ code }) => code)).toEqual(['CA', 'ME', 'US']);
  });

  it('keeps only the saved country when the LMS allows none', () => {
    expect(getSortedCountries(countryList, [], 'ME').map(({ code }) => code)).toEqual(['ME']);
  });
});
