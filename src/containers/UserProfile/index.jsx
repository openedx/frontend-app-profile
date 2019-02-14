import { connect } from 'react-redux';

import UserProfile from '../../components/UserProfile';
import {
  saveUserProfile,
  openEditableField,
  closeEditableField,
} from '../../actions/profile';

const mapStateToProps = state => ({
  currentlyEditingField: state.profile.currentlyEditingField,
  saveState: state.profile.saveState,
  error: state.profile.error,
  profileImage: state.userAccount.profileImage.imageUrlLarge,
  fullName: state.userAccount.name,
  username: state.userAccount.username,
  userLocation: state.userAccount.country,
  education: state.userAccount.levelOfEducation,
  socialLinks: state.userAccount.socialLinks,
  bio: state.userAccount.bio,
  certificates: null,
});

export default connect(mapStateToProps, {
  saveUserProfile,
  openEditableField,
  closeEditableField,
})(UserProfile);
