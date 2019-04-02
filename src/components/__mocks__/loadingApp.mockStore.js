module.exports = {
  authentication: {
    userId: 9,
    username: 'staff'
  },
  userAccount: {
    loading: false,
    error: null,
    username: null,
    email: null,
    bio: null,
    name: null,
    country: null,
    socialLinks: null,
    profileImage: {
      imageUrlMedium: null,
      imageUrlLarge: null
    },
    levelOfEducation: null
  },
  profilePage: {
    errors: {},
    saveState: null,
    savePhotoState: null,
    currentlyEditingField: null,
    account: {
      socialLinks: []
    },
    preferences: {},
    courseCertificates: [],
    drafts: {},
    isLoadingProfile: true
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
