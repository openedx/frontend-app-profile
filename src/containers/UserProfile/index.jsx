import { connect } from 'react-redux';

import UserProfile from '../../components/UserProfile';
import {
  fetchProfile,
  saveProfile,
  saveProfilePhoto,
  deleteProfilePhoto,
  openField,
  closeField,
} from '../../actions/profile';

const mapStateToProps = (state) => {
  const profileImage =
    state.profilePage.profile.profileImage != null
      ? state.profilePage.profile.profileImage.imageUrlLarge
      : null;
  return {
    isCurrentUserProfile: state.userAccount.username === state.profilePage.profile.username,
    currentlyEditingField: state.profilePage.currentlyEditingField,
    saveState: state.profilePage.saveState,
    savePhotoState: state.profilePage.savePhotoState,
    error: state.profilePage.error,
    profileImage,
    fullName: state.profilePage.profile.name,
    username: state.profilePage.profile.username,
    userLocation: state.profilePage.profile.country,
    education: state.profilePage.profile.levelOfEducation,
    socialLinks: state.profilePage.profile.socialLinks,
    bio: state.profilePage.profile.bio,
    certificates: null,
    accountPrivacy: state.profilePage.preferences.accountPrivacy,
    visibility: state.profilePage.preferences.visibility || {},
  };
};

export default connect(
  mapStateToProps,
  {
    fetchProfile,
    saveProfile,
    saveProfilePhoto,
    deleteProfilePhoto,
    openField,
    closeField,
  },
)(UserProfile);
