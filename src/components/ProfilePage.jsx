import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col, Alert, Button } from 'reactstrap';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';

// Analytics
import { logEvent } from '../analytics/analytics';

// Actions
import {
  fetchProfile,
  saveProfile,
  saveProfilePhoto,
  deleteProfilePhoto,
  openForm,
  closeForm,
  updateDraft,
} from '../actions/ProfileActions';

// Components
import ProfileAvatar from './ProfilePage/ProfileAvatar';
import Name from './ProfilePage/Name';
import Country from './ProfilePage/Country';
import PreferredLanguage from './ProfilePage/PreferredLanguage';
import Education from './ProfilePage/Education';
import SocialLinks from './ProfilePage/SocialLinks';
import Bio from './ProfilePage/Bio';
import Certificates from './ProfilePage/Certificates';
import AgeMessage from './ProfilePage/AgeMessage';
import DateJoined from './ProfilePage/DateJoined';
import PageLoading from './ProfilePage/PageLoading';
import Banner from './ProfilePage/elements/Banner';
import { profilePageSelector } from '../selectors/ProfilePageSelector';

// Configuration
import { configuration } from '../config/environment';

// i18n
import messages from './ProfilePage.messages';

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
    logEvent('edx.profile.viewed', {
      username: this.props.match.params.username,
    });
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

  handleChange(name, value) {
    this.props.updateDraft(name, value);
  }

  // Inserted into the DOM in two places (for responsive layout)
  renderViewMyRecordsButton() {
    return (
      <Button color="primary" href={configuration.VIEW_MY_RECORDS_URL} target="blank">
        {this.props.intl.formatMessage(messages['profile.viewMyRecords'])}
      </Button>
    );
  }

  // Inserted into the DOM in two places (for responsive layout)
  renderHeadingLockup() {
    const { username, dateJoined } = this.props;

    return (
      <React.Fragment>
        <h1 className="h2 mb-0">{username}</h1>
        <DateJoined date={dateJoined} />
        <hr className="d-none d-md-block" />
      </React.Fragment>
    );
  }

  renderPhotoUploadErrorMessage() {
    const { photoUploadError } = this.props;

    if (photoUploadError === null) {
      return null;
    }

    return (
      <Row>
        <Col md={4} lg={3}>
          <Alert color="danger">{photoUploadError.userMessage}</Alert>
        </Col>
      </Row>
    );
  }

  render() {
    const {
      profileImage,
      name,
      visibilityName,
      country,
      visibilityCountry,
      education,
      visibilityEducation,
      socialLinks,
      draftSocialLinksByPlatform,
      visibilitySocialLinks,
      languageProficiencies,
      visibilityLanguageProficiencies,
      visibilityCourseCertificates,
      bio,
      visibilityBio,
      requiresParentalConsent,
      isCurrentUserProfile,
      isLoadingProfile,
    } = this.props;

    if (isLoadingProfile) return <PageLoading />;

    const commonFormProps = {
      openHandler: this.handleOpen,
      closeHandler: this.handleClose,
      submitHandler: this.handleSubmit,
      changeHandler: this.handleChange,
    };

    const shouldShowAgeMessage = requiresParentalConsent && isCurrentUserProfile;

    return (
      <div className="profile-page">
        <Banner />
        <Container fluid>
          <Row className="align-items-center pt-4 mb-4 pt-md-0 mb-md-0">
            <Col xs="auto" md={4} lg={3}>
              <div className="d-flex align-items-center d-md-block">
                <ProfileAvatar
                  className="mb-md-3"
                  src={profileImage.src}
                  isDefault={profileImage.isDefault}
                  onSave={this.handleSaveProfilePhoto}
                  onDelete={this.handleDeleteProfilePhoto}
                  savePhotoState={this.props.savePhotoState}
                  isEditable={this.props.isCurrentUserProfile}
                />
              </div>
            </Col>
            <Col className="pl-0">
              <div className="d-md-none">
                {this.renderHeadingLockup()}
              </div>
              <div className="d-none d-md-block float-right">
                {this.renderViewMyRecordsButton()}
              </div>
            </Col>
          </Row>
          {this.renderPhotoUploadErrorMessage()}
          <Row>
            <Col md={4} lg={4}>
              <div className="d-none d-md-block mb-4">
                {this.renderHeadingLockup()}
              </div>
              <div className="d-md-none mb-4">
                {this.renderViewMyRecordsButton()}
              </div>
              <Name
                name={name}
                visibilityName={visibilityName}
                formId="name"
                {...commonFormProps}
              />
              <Country
                country={country}
                visibilityCountry={visibilityCountry}
                formId="country"
                {...commonFormProps}
              />
              <PreferredLanguage
                languageProficiencies={languageProficiencies}
                visibilityLanguageProficiencies={visibilityLanguageProficiencies}
                formId="languageProficiencies"
                {...commonFormProps}
              />
              <Education
                education={education}
                visibilityEducation={visibilityEducation}
                formId="education"
                {...commonFormProps}
              />
              <SocialLinks
                socialLinks={socialLinks}
                draftSocialLinksByPlatform={draftSocialLinksByPlatform}
                visibilitySocialLinks={visibilitySocialLinks}
                formId="socialLinks"
                {...commonFormProps}
              />
            </Col>
            <Col md={8} lg={{ size: 7, offset: 1 }} className="pt-md-3">
              {shouldShowAgeMessage ? <AgeMessage accountURL="#account" /> : null}
              <Bio
                bio={bio}
                visibilityBio={visibilityBio}
                formId="bio"
                {...commonFormProps}
              />
              <Certificates
                visibilityCourseCertificates={visibilityCourseCertificates}
                formId="certificates"
                {...commonFormProps}
              />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

ProfilePage.propTypes = {
  // Account data
  username: PropTypes.string,
  requiresParentalConsent: PropTypes.bool,
  dateJoined: PropTypes.string,
  isCurrentUserProfile: PropTypes.bool.isRequired,

  // Bio form data
  bio: PropTypes.string,
  visibilityBio: PropTypes.string.isRequired,

  // Certificates form data
  courseCertificates: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
  })),
  visibilityCourseCertificates: PropTypes.string.isRequired,

  // Country form data
  country: PropTypes.string,
  visibilityCountry: PropTypes.string.isRequired,

  // Education form data
  education: PropTypes.string,
  visibilityEducation: PropTypes.string.isRequired,

  // Language proficiency form data
  languageProficiencies: PropTypes.arrayOf(PropTypes.shape({
    code: PropTypes.string.isRequired,
  })),
  visibilityLanguageProficiencies: PropTypes.string.isRequired,

  // Name form data
  name: PropTypes.string,
  visibilityName: PropTypes.string.isRequired,

  // Social links form data
  socialLinks: PropTypes.arrayOf(PropTypes.shape({
    platform: PropTypes.string,
    socialLink: PropTypes.string,
  })),
  draftSocialLinksByPlatform: PropTypes.objectOf(PropTypes.shape({
    platform: PropTypes.string,
    socialLink: PropTypes.string,
  })),
  visibilitySocialLinks: PropTypes.string.isRequired,

  // Other data we need
  profileImage: PropTypes.shape({
    src: PropTypes.string,
    isDefault: PropTypes.bool,
  }),
  saveState: PropTypes.oneOf([null, 'pending', 'complete', 'error']),
  savePhotoState: PropTypes.oneOf([null, 'pending', 'complete', 'error']),
  isLoadingProfile: PropTypes.bool.isRequired,

  // Page state helpers
  photoUploadError: PropTypes.objectOf(PropTypes.string),

  // Actions
  fetchProfile: PropTypes.func.isRequired,
  saveProfile: PropTypes.func.isRequired,
  saveProfilePhoto: PropTypes.func.isRequired,
  deleteProfilePhoto: PropTypes.func.isRequired,
  openForm: PropTypes.func.isRequired,
  closeForm: PropTypes.func.isRequired,
  updateDraft: PropTypes.func.isRequired,

  // Router
  match: PropTypes.shape({
    params: PropTypes.shape({
      username: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,

  // i18n
  intl: intlShape.isRequired,
};

ProfilePage.defaultProps = {
  saveState: null,
  savePhotoState: null,
  photoUploadError: {},
  profileImage: {},
  name: null,
  username: null,
  education: null,
  country: null,
  socialLinks: [],
  draftSocialLinksByPlatform: {},
  bio: null,
  languageProficiencies: [],
  courseCertificates: null,
  requiresParentalConsent: null,
  dateJoined: null,
};

export default connect(
  profilePageSelector,
  {
    fetchProfile,
    saveProfilePhoto,
    deleteProfilePhoto,
    saveProfile,
    openForm,
    closeForm,
    updateDraft,
  },
)(injectIntl(ProfilePage));
