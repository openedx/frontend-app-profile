import { connect } from 'react-redux';

import UserProfile from '../../components/UserProfile';
import {
  saveUserProfile,
  saveUserProfilePhoto,
  openEditableField,
  closeEditableField,
} from '../../actions/profile';

const mapStateToProps = state => ({
  currentlyEditingField: state.profile.currentlyEditingField,
  saveState: state.profile.saveState,
  savePhotoState: state.profile.savePhotoState,
  error: state.profile.error,
  bannerImage: 'https://source.unsplash.com/featured/1000x200/?colored,pattern',
  profileImage: state.userAccount.profileImage.imageUrlLarge,
  fullName: state.userAccount.name,
  username: state.userAccount.username,
  userLocation: state.userAccount.country,
  education: state.userAccount.levelOfEducation,
  socialLinks: state.userAccount.socialLinks,
  bio: state.userAccount.bio,
  certificates: [{ title: 'Certificate 1' }, { title: 'Certificate 2' }, { title: 'Certificate 3' }],
  courses: [{ title: 'Course ' }, { title: 'Course 2' }, { title: 'Course 3' }],
});

export default connect(mapStateToProps, {
  saveUserProfile,
  saveUserProfilePhoto,
  openEditableField,
  closeEditableField,
})(UserProfile);
