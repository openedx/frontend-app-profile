module.exports = {
  userAccount: {
    loading: false,
    error: null,
    username: 'staff',
    email: null,
    bio: null,
    name: null,
    country: null,
    socialLinks: null,
    profileImage: {
      imageUrlMedium: null,
      imageUrlLarge: null
    },
    levelOfEducation: null,
    learningGoal: null
  },
  profilePage: {
    errors: {},
    saveState: 'error',
    savePhotoState: null,
    currentlyEditingField: null,
    account: {
      username: '',
      socialLinks: []
    },
    preferences: {},
    courseCertificates: [],
    drafts: {},
    isLoadingProfile: false,
    isAuthenticatedUserProfile: true,
  },
  router: {
    location: {
      pathname: '/u/staffTest',
      search: '',
      hash: ''
    },
    action: 'POP'
  }
};