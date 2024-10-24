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
    saveState: null,
    savePhotoState: null,
    currentlyEditingField: null,
    account: {
      username: 'staff',
      socialLinks: []
    },
    preferences: {},
    courseCertificates: [],
    drafts: {},
    isLoadingProfile: true,
    isAuthenticatedUserProfile: true,
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
