import { connect } from 'react-redux';

import { getSocialLinks } from '../../constants/social';
import UserAccount from '../../components/UserAccount';
import { saveUserProfile } from '../../actions/profileActions';

const mapStateToProps = state => ({
  saveState: state.profile.saveState,
  error: state.profile.error,
  bannerImage: 'https://source.unsplash.com/featured/1000x200/?colored,pattern',
  profileImage: state.userAccount.profileImage.imageUrlLarge,
  fullName: state.userAccount.name,
  username: state.userAccount.username,
  userLocation: state.userAccount.country,
  education: state.userAccount.levelOfEducation,
  socialLinks: getSocialLinks(state.userAccount.socialLinks),
  bio: state.userAccount.bio,
  certificates: [{ title: 'Certificate 1' }, { title: 'Certificate 2' }, { title: 'Certificate 3' }],
  courses: [{ title: 'Course ' }, { title: 'Course 2' }, { title: 'Course 3' }],
});

export default connect(mapStateToProps, {
  saveUserProfile,
})(UserAccount);
