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
    learningGoal: null,
  },
  profilePage: {
    errors: {},
    saveState: 'pending',
    savePhotoState: null,
    currentlyEditingField: 'bio',
    isAuthenticatedUserProfile: true,
    account: {
      mailingAddress: null,
      profileImage: {
        imageUrlFull: 'http://localhost:18000/media/profile-images/d2a9bdc2ba165dcefc73265c54bf9a20_500.jpg?v=1552495012',
        imageUrlLarge: 'http://localhost:18000/media/profile-images/d2a9bdc2ba165dcefc73265c54bf9a20_120.jpg?v=1552495012',
        imageUrlMedium: 'http://localhost:18000/media/profile-images/d2a9bdc2ba165dcefc73265c54bf9a20_50.jpg?v=1552495012',
        imageUrlSmall: 'http://localhost:18000/media/profile-images/d2a9bdc2ba165dcefc73265c54bf9a20_30.jpg?v=1552495012',
        hasImage: true
      },
      extendedProfile: [],
      dateJoined: '2017-06-07T00:44:23Z',
      accomplishmentsShared: false,
      email: 'staff@example.com',
      username: 'staff',
      bio: 'This is my bio',
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
      name: 'Lemon Seltzer',
      secondaryEmail: null,
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
      timeZone: null,
      levelOfEducation: 'el',
      gender: null,
      accountPrivacy: 'custom',
      learningGoal: null,
    },
    preferences: {
      visibilityUserLocation: 'all_users',
      visibilitySocialLinks: 'all_users',
      visibilityCertificates: 'private',
      visibilityLevelOfEducation: 'private',
      visibilityCourseCertificates: 'all_users',
      prefLang: 'en',
      visibilityBio: 'all_users',
      visibilityName: 'private',
      visibilityLanguageProficiencies: 'all_users',
      visibilityCountry: 'all_users',
      accountPrivacy: 'custom',
      visibilityLearningGoal: 'private',
    },
    courseCertificates: [
      {
        username: 'staff',
        status: 'downloadable',
        courseDisplayName: 'edX Demonstration Course',
        grade: '0.89',
        courseId: 'course-v1:edX+DemoX+Demo_Course',
        courseOrganization: 'edX',
        modifiedDate: '2019-03-04T19:31:39.930255Z',
        isPassing: true,
        downloadUrl: 'http://www.example.com/',
        certificateType: 'verified',
        createdDate: '2019-03-04T19:31:39.896806Z'
      }
    ],
    drafts: {},
    isLoadingProfile: false
  },
  router: {
    location: {
      pathname: '/u/staff',
      search: '',
      hash: ''
    },
    action: 'POP'
  }
};
