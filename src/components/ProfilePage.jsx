import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'reactstrap';
import { connect } from 'react-redux';

// Actions
import {
  fetchProfile,
  saveProfile,
  saveProfilePhoto,
  deleteProfilePhoto,
  openForm,
  closeForm,
  updateVisibilityDraft,
  updateAccountDraft,
} from '../actions/ProfileActions';

// Components
import ProfileAvatar from './ProfilePage/ProfileAvatar';
import Name from './ProfilePage/Name';
import Country from './ProfilePage/Country';
import Education from './ProfilePage/Education';
// import SocialLinks from './ProfilePage/SocialLinks';
import Bio from './ProfilePage/Bio';
// import Certificates from './ProfilePage/Certificates';

export class ProfilePage extends React.Component {
  constructor(props) {
    super(props);

    this.handleSaveProfilePhoto = this.handleSaveProfilePhoto.bind(this);
    this.handleDeleteProfilePhoto = this.handleDeleteProfilePhoto.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.props.fetchProfile(this.props.match.params.username);
  }

  handleSaveProfilePhoto(formData) {
    this.props.saveProfilePhoto(this.props.username, formData);
  }

  handleDeleteProfilePhoto() {
    this.props.deleteProfilePhoto(this.props.username);
  }

  handleClose(formId) {
    this.props.closeForm(formId);
  }

  handleOpen(formId) {
    this.props.openForm(formId);
  }

  handleSubmit(formId) {
    this.props.saveProfile(formId);
  }

  handleChange(formId, name, value) {
    if (name === 'visibility') {
      this.props.updateVisibilityDraft(formId, value);
    } else {
      this.props.updateAccountDraft(formId, value);
    }
  }

  render() {
    const { profileImage, username, errors } = this.props;

    const commonFormProps = {
      openHandler: this.handleOpen,
      closeHandler: this.handleClose,
      submitHandler: this.handleSubmit,
      changeHandler: this.handleChange,
      errors,
    };

    return (
      <div className="profile-page">
        <div className="bg-banner bg-program-micro-masters d-none d-md-block p-relative" />
        <Container fluid>
          <Row>
            <Col md={4} lg={3}>
              <div className="d-flex align-items-center d-md-block mt-4 mt-md-0">
                <ProfileAvatar
                  className="mb-md-3"
                  src={profileImage}
                  onSave={this.handleSaveProfilePhoto}
                  onDelete={this.handleDeleteProfilePhoto}
                  savePhotoState={this.props.savePhotoState}
                />
                <div>
                  <h2 className="mb-0">{username}</h2>
                  <p className="mb-0">Member since 2017 - THIS IS FAKE</p>
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs={{ order: 2 }} md={{ size: 4, order: 1 }} lg={3} className="mt-md-4">
              <Name formId="name" {...commonFormProps} />
              <Country formId="country" {...commonFormProps} />
              <Education formId="education" {...commonFormProps} />
              {/* <SocialLinks formId="socialLinks" {...commonFormProps} /> */}
            </Col>
            <Col
              xs={{ order: 1 }}
              md={{ size: 8, order: 2 }}
              lg={{ size: 8, offset: 1 }}
              className="mt-4 mt-md-n5"
            >
              <Bio formId="bio" {...commonFormProps} />
              {/* <Certificates formId="certificates" {...commonFormProps} /> */}
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

ProfilePage.propTypes = {
  // Page state helpers
  currentlyEditingField: PropTypes.string,
  saveState: PropTypes.oneOf([null, 'pending', 'complete', 'error']),
  savePhotoState: PropTypes.oneOf([null, 'pending', 'complete', 'error']),
  isCurrentUserProfile: PropTypes.bool.isRequired,
  errors: PropTypes.objectOf(PropTypes.string),

  // Profile data
  username: PropTypes.string,
  profileImage: PropTypes.string,
  accountPrivacy: PropTypes.string,
  certificates: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
  })),

  // Profile data for form fields
  education: PropTypes.string,
  socialLinks: PropTypes.arrayOf(PropTypes.shape({
    platform: PropTypes.string,
    socialLink: PropTypes.string,
  })),
  bio: PropTypes.string,
  visibility: PropTypes.objectOf(PropTypes.string),

  // Actions
  fetchProfile: PropTypes.func.isRequired,
  saveProfile: PropTypes.func.isRequired,
  saveProfilePhoto: PropTypes.func.isRequired,
  deleteProfilePhoto: PropTypes.func.isRequired,
  openForm: PropTypes.func.isRequired,
  closeForm: PropTypes.func.isRequired,
  updateVisibilityDraft: PropTypes.func.isRequired,
  updateAccountDraft: PropTypes.func.isRequired,

  // Router
  match: PropTypes.shape({
    params: PropTypes.shape({
      username: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

ProfilePage.defaultProps = {
  currentlyEditingField: null,
  saveState: null,
  savePhotoState: null,
  errors: {},
  profileImage: null,
  username: null,
  education: null,
  socialLinks: [],
  bio: null,
  certificates: null,
  accountPrivacy: null,
  visibility: {}, // eslint-disable-line
};

const mapStateToProps = (state) => {
  const profileImage =
    state.profilePage.account.profileImage != null
      ? state.profilePage.account.profileImage.imageUrlLarge
      : null;
  return {
    isCurrentUserProfile: state.userAccount.username === state.profilePage.account.username,
    currentlyEditingField: state.profilePage.currentlyEditingField,
    saveState: state.profilePage.saveState,
    savePhotoState: state.profilePage.savePhotoState,
    error: state.profilePage.error,
    profileImage,

    username: state.profilePage.account.username,
    education: state.profilePage.account.levelOfEducation,
    socialLinks: state.profilePage.account.socialLinks,
    bio: state.profilePage.account.bio,
    certificates: state.profilePage.account.certificates,
    accountPrivacy: state.profilePage.preferences.accountPrivacy,
    visibility: state.profilePage.preferences.visibility || {},
  };
};

export default connect(
  mapStateToProps,
  {
    fetchProfile,
    saveProfilePhoto,
    deleteProfilePhoto,
    saveProfile,
    openForm,
    closeForm,
    updateVisibilityDraft,
    updateAccountDraft,
  },
)(ProfilePage);
