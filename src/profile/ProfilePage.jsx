import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { sendTrackingLogEvent } from '@edx/frontend-platform/analytics';
import { ensureConfig, getConfig } from '@edx/frontend-platform';
import { AppContext } from '@edx/frontend-platform/react';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Alert, Hyperlink } from '@openedx/paragon';

// Actions
import {
  fetchProfile,
  saveProfile,
  saveProfilePhoto,
  deleteProfilePhoto,
  openForm,
  closeForm,
  updateDraft,
} from './data/actions';

// Components
import ProfileAvatar from './forms/ProfileAvatar';
import Name from './forms/Name';
import Country from './forms/Country';
import PreferredLanguage from './forms/PreferredLanguage';
import Education from './forms/Education';
import SocialLinks from './forms/SocialLinks';
import Bio from './forms/Bio';
import Certificates from './forms/Certificates';
import AgeMessage from './AgeMessage';
import DateJoined from './DateJoined';
import UsernameDescription from './UsernameDescription';
import PageLoading from './PageLoading';
import Banner from './Banner';
import LearningGoal from './forms/LearningGoal';

// Selectors
import { profilePageSelector } from './data/selectors';

// i18n
import messages from './ProfilePage.messages';

import withParams from '../utils/hoc';

ensureConfig(['CREDENTIALS_BASE_URL', 'LMS_BASE_URL'], 'ProfilePage');

class ProfilePage extends React.Component {
  constructor(props, context) {
    super(props, context);

    const credentialsBaseUrl = context.config.CREDENTIALS_BASE_URL;
    this.state = {
      viewMyRecordsUrl: credentialsBaseUrl ? `${credentialsBaseUrl}/records` : null,
      accountSettingsUrl: context.config.ACCOUNT_SETTINGS_URL,
    };

    this.handleSaveProfilePhoto = this.handleSaveProfilePhoto.bind(this);
    this.handleDeleteProfilePhoto = this.handleDeleteProfilePhoto.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.props.fetchProfile(this.props.params.username);
    sendTrackingLogEvent('edx.profile.viewed', {
      username: this.props.params.username,
    });
  }

  handleSaveProfilePhoto(formData) {
    this.props.saveProfilePhoto(this.context.authenticatedUser.username, formData);
  }

  handleDeleteProfilePhoto() {
    this.props.deleteProfilePhoto(this.context.authenticatedUser.username);
  }

  handleClose(formId) {
    this.props.closeForm(formId);
  }

  handleOpen(formId) {
    this.props.openForm(formId);
  }

  handleSubmit(formId) {
    this.props.saveProfile(formId, this.context.authenticatedUser.username);
  }

  handleChange(name, value) {
    this.props.updateDraft(name, value);
  }

  isYOBDisabled() {
    const { yearOfBirth } = this.props;
    const currentYear = new Date().getFullYear();
    const isAgeOrNotCompliant = !yearOfBirth || ((currentYear - yearOfBirth) < 13);

    return isAgeOrNotCompliant && getConfig().COLLECT_YEAR_OF_BIRTH !== 'true';
  }

  isAuthenticatedUserProfile() {
    return this.props.params.username === this.context.authenticatedUser.username;
  }

  // Inserted into the DOM in two places (for responsive layout)
  renderViewMyRecordsButton() {
    if (!(this.state.viewMyRecordsUrl && this.isAuthenticatedUserProfile())) {
      return null;
    }

    return (
      <Hyperlink className="btn btn-primary" destination={this.state.viewMyRecordsUrl} target="_blank">
        {this.props.intl.formatMessage(messages['profile.viewMyRecords'])}
      </Hyperlink>
    );
  }

  // Inserted into the DOM in two places (for responsive layout)
  renderHeadingLockup() {
    const { dateJoined } = this.props;

    return (
      <span data-hj-suppress>
        <h1 className="h2 mb-0 font-weight-bold text-truncate">{this.props.params.username}</h1>
        <DateJoined date={dateJoined} />
        {this.isYOBDisabled() && <UsernameDescription />}
        <hr className="d-none d-md-block" />
      </span>
    );
  }

  renderPhotoUploadErrorMessage() {
    const { photoUploadError } = this.props;

    if (photoUploadError === null) {
      return null;
    }

    return (
      <div className="row">
        <div className="col-md-4 col-lg-3">
          <Alert variant="danger" dismissible={false} show>
            {photoUploadError.userMessage}
          </Alert>
        </div>
      </div>
    );
  }

  renderAgeMessage() {
    const { requiresParentalConsent } = this.props;
    const shouldShowAgeMessage = requiresParentalConsent && this.isAuthenticatedUserProfile();

    if (!shouldShowAgeMessage) {
      return null;
    }
    return <AgeMessage accountSettingsUrl={this.state.accountSettingsUrl} />;
  }

  renderContent() {
    const {
      profileImage,
      name,
      visibilityName,
      country,
      visibilityCountry,
      levelOfEducation,
      visibilityLevelOfEducation,
      socialLinks,
      draftSocialLinksByPlatform,
      visibilitySocialLinks,
      learningGoal,
      visibilityLearningGoal,
      languageProficiencies,
      visibilityLanguageProficiencies,
      courseCertificates,
      visibilityCourseCertificates,
      bio,
      visibilityBio,
      requiresParentalConsent,
      isLoadingProfile,
      username,
      saveState,
      navigate,
    } = this.props;

    if (isLoadingProfile) {
      return <PageLoading srMessage={this.props.intl.formatMessage(messages['profile.loading'])} />;
    }

    if (!username && saveState === 'error' && navigate) {
      navigate('/notfound');
    }

    const commonFormProps = {
      openHandler: this.handleOpen,
      closeHandler: this.handleClose,
      submitHandler: this.handleSubmit,
      changeHandler: this.handleChange,
    };

    const isBlockVisible = (blockInfo) => this.isAuthenticatedUserProfile()
      || (!this.isAuthenticatedUserProfile() && Boolean(blockInfo));

    const isLanguageBlockVisible = isBlockVisible(languageProficiencies.length);
    const isEducationBlockVisible = isBlockVisible(levelOfEducation);
    const isSocialLinksBLockVisible = isBlockVisible(socialLinks.some((link) => link.socialLink !== null));
    const isBioBlockVisible = isBlockVisible(bio);
    const isCertificatesBlockVisible = isBlockVisible(courseCertificates.length);
    const isNameBlockVisible = isBlockVisible(name);
    const isLocationBlockVisible = isBlockVisible(country);

    return (
      <div className="container-fluid">
        <div className="row align-items-center pt-4 mb-4 pt-md-0 mb-md-0">
          <div className="col-auto col-md-4 col-lg-3">
            <div className="d-flex align-items-center d-md-block">
              <ProfileAvatar
                className="mb-md-3"
                src={profileImage.src}
                isDefault={profileImage.isDefault}
                onSave={this.handleSaveProfilePhoto}
                onDelete={this.handleDeleteProfilePhoto}
                savePhotoState={this.props.savePhotoState}
                isEditable={this.isAuthenticatedUserProfile() && !requiresParentalConsent}
              />
            </div>
          </div>
          <div className="col">
            <div className="d-md-none">
              {this.renderHeadingLockup()}
            </div>
            <div className="d-none d-md-block float-right">
              {this.renderViewMyRecordsButton()}
            </div>
          </div>
        </div>
        {this.renderPhotoUploadErrorMessage()}
        <div className="row">
          <div className="col-md-4 col-lg-4">
            <div className="d-none d-md-block mb-4">
              {this.renderHeadingLockup()}
            </div>
            <div className="d-md-none mb-4">
              {this.renderViewMyRecordsButton()}
            </div>
            {isNameBlockVisible && (
              <Name
                name={name}
                visibilityName={visibilityName}
                formId="name"
                {...commonFormProps}
              />
            )}
            {isLocationBlockVisible && (
              <Country
                country={country}
                visibilityCountry={visibilityCountry}
                formId="country"
                {...commonFormProps}
              />
            )}
            {isLanguageBlockVisible && (
              <PreferredLanguage
                languageProficiencies={languageProficiencies}
                visibilityLanguageProficiencies={visibilityLanguageProficiencies}
                formId="languageProficiencies"
                {...commonFormProps}
              />
            )}
            {isEducationBlockVisible && (
              <Education
                levelOfEducation={levelOfEducation}
                visibilityLevelOfEducation={visibilityLevelOfEducation}
                formId="levelOfEducation"
                {...commonFormProps}
              />
            )}
            {isSocialLinksBLockVisible && (
              <SocialLinks
                socialLinks={socialLinks}
                draftSocialLinksByPlatform={draftSocialLinksByPlatform}
                visibilitySocialLinks={visibilitySocialLinks}
                formId="socialLinks"
                {...commonFormProps}
              />
            )}
          </div>
          <div className="pt-md-3 col-md-8 col-lg-7 offset-lg-1">
            {!this.isYOBDisabled() && this.renderAgeMessage()}
            {isBioBlockVisible && (
              <Bio
                bio={bio}
                visibilityBio={visibilityBio}
                formId="bio"
                {...commonFormProps}
              />
            )}
            {getConfig().ENABLE_SKILLS_BUILDER_PROFILE && (
              <LearningGoal
                learningGoal={learningGoal}
                visibilityLearningGoal={visibilityLearningGoal}
                formId="learningGoal"
                {...commonFormProps}
              />
            )}
            {isCertificatesBlockVisible && (
              <Certificates
                visibilityCourseCertificates={visibilityCourseCertificates}
                formId="certificates"
                {...commonFormProps}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="profile-page">
        <Banner />
        {this.renderContent()}
      </div>
    );
  }
}

ProfilePage.contextType = AppContext;

ProfilePage.propTypes = {
  // Account data
  requiresParentalConsent: PropTypes.bool,
  dateJoined: PropTypes.string,
  username: PropTypes.string,

  // Bio form data
  bio: PropTypes.string,
  yearOfBirth: PropTypes.number,
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
  levelOfEducation: PropTypes.string,
  visibilityLevelOfEducation: PropTypes.string.isRequired,

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

  // Learning Goal form data
  learningGoal: PropTypes.string,
  visibilityLearningGoal: PropTypes.string.isRequired,

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
  navigate: PropTypes.func.isRequired,

  // Router
  params: PropTypes.shape({
    username: PropTypes.string.isRequired,
  }).isRequired,

  // i18n
  intl: intlShape.isRequired,
};

ProfilePage.defaultProps = {
  saveState: null,
  username: '',
  savePhotoState: null,
  photoUploadError: {},
  profileImage: {},
  name: null,
  yearOfBirth: null,
  levelOfEducation: null,
  country: null,
  socialLinks: [],
  draftSocialLinksByPlatform: {},
  bio: null,
  learningGoal: null,
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
)(injectIntl(withParams(ProfilePage)));
