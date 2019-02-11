import { connect } from 'react-redux';
import { saveUserAccount, UserAccountApiService } from '@edx/frontend-auth';

import apiClient from '../../data/apiClient';
import { getSocialLinks } from '../../constants/social';
import UserAccount from '../../components/UserAccount';

const PROP_TO_STATE_MAP = {
  fullName: 'name',
  userLocation: 'country',
  education: 'levelOfEducation',
  socialLinks: socialLinks => Object.keys(socialLinks).map(linkKey => ({
    platform: linkKey,
    socialLink: socialLinks[linkKey].url,
  })),
};

const mapPropsToState = (props) => {
  const state = {};
  Object.keys(props).forEach((prop) => {
    const propModifier = PROP_TO_STATE_MAP[prop] || prop;
    if (typeof propModifier === 'function') {
      state[prop] = propModifier(props[prop]);
    } else {
      state[propModifier] = props[prop];
    }
  });
  return state;
};

const mapStateToProps = state => ({
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

const userAccountApiService = new UserAccountApiService(apiClient, process.env.LMS_BASE_URL);
const mapDispatchToProps = {
  saveUserAccount: (username, props, visibility) => (
    saveUserAccount(
      userAccountApiService,
      username,
      mapPropsToState(props),
      visibility,
    )
  ),
};

export default connect(mapStateToProps, mapDispatchToProps)(UserAccount);
