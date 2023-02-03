module.exports = {
  userAccount: {
    loading: false,
    error: null,
    username: 'staff',
    email: 'staff@example.com',
    bio: 'This is my bio',
    name: 'Lemon Seltzer',
    country: 'ME',
    socialLinks: [
      {
        platform: 'facebook',
        socialLink: 'https://www.facebook.com/aloha'
      },
      {
        platform: 'twitter',
        socialLink: 'https://www.twitter.com/ALOHA'
      }
    ],
    profileImage: {
      imageUrlFull: 'http://localhost:18000/media/profile-images/d2a9bdc2ba165dcefc73265c54bf9a20_500.jpg?v=1552495012',
      imageUrlLarge: 'http://localhost:18000/media/profile-images/d2a9bdc2ba165dcefc73265c54bf9a20_120.jpg?v=1552495012',
      imageUrlMedium: 'http://localhost:18000/media/profile-images/d2a9bdc2ba165dcefc73265c54bf9a20_50.jpg?v=1552495012',
      imageUrlSmall: 'http://localhost:18000/media/profile-images/d2a9bdc2ba165dcefc73265c54bf9a20_30.jpg?v=1552495012',
      hasImage: true
    },
    levelOfEducation: 'el',
    mailingAddress: null,
    extendedProfile: [],
    dateJoined: '2017-06-07T00:44:23Z',
    accomplishmentsShared: false,
    isActive: true,
    yearOfBirth: 1901,
    goals: null,
    languageProficiencies: [
      {
        code: 'yo'
      }
    ],
    courseCertificates: null,
    requiresParentalConsent: false,
    secondaryEmail: null,
    timeZone: null,
    gender: null,
    accountPrivacy: 'custom',
    learningGoal: 'advance_career',
  },
  profilePage: {
    errors: {},
    saveState: null,
    savePhotoState: null,
    currentlyEditingField: null,
    isAuthenticatedUserProfile: false,
    account: {
      mailingAddress: null,
      profileImage: {
        imageUrlFull: 'http://localhost:18000/static/images/profiles/default_500.png',
        imageUrlLarge: 'http://localhost:18000/static/images/profiles/default_120.png',
        imageUrlMedium: 'http://localhost:18000/static/images/profiles/default_50.png',
        imageUrlSmall: 'http://localhost:18000/static/images/profiles/default_30.png',
        hasImage: false
      },
      extendedProfile: [],
      dateJoined: '2017-06-07T00:44:19Z',
      accomplishmentsShared: false,
      email: 'verified@example.com',
      username: 'verified',
      bio: null,
      isActive: true,
      yearOfBirth: null,
      goals: null,
      languageProficiencies: [],
      courseCertificates: null,
      requiresParentalConsent: true,
      name: '',
      secondaryEmail: null,
      country: null,
      socialLinks: [],
      timeZone: null,
      levelOfEducation: null,
      gender: null,
      accountPrivacy: 'private'
    },
    preferences: {},
    courseCertificates: [],
    drafts: {},
    isLoadingProfile: false,
    learningGoal: 'advance_career',
  },
  router: {
    location: {
      pathname: '/u/verified',
      search: '',
      hash: ''
    },
    action: 'POP'
  }
};
