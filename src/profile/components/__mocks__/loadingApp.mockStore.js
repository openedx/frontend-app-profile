module.exports = {
  authentication: {
    userId: 9,
    username: 'staff'
  },
  configuration: {
    VIEW_MY_RECORDS_URL: 'http://localhost:18150/records',
    ACCOUNT_SETTINGS_URL: 'http://localhost:18000/account/settings',
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
