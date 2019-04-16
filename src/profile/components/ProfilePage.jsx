import React from 'react';
import PropTypes from 'prop-types';
import { StatusAlert, Hyperlink } from '@edx/paragon';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from '@edx/frontend-i18n'; // eslint-disable-line
import { sendTrackingLogEvent } from '@edx/frontend-analytics';

// Actions
import {
  fetchProfile,
  saveProfile,
  saveProfilePhoto,
  deleteProfilePhoto,
  openForm,
  closeForm,
  updateDraft,
} from '../actions';

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
import { PageLoading } from '../../common';
import Banner from './Banner';
import { profilePageSelector } from '../selectors';

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
    sendTrackingLogEvent('edx.profile.viewed', {
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
    if (!this.props.isAuthenticatedUserProfile) {
      return null;
    }

    return (
      <Hyperlink className="btn btn-primary" href={this.props.configuration.VIEW_MY_RECORDS_URL} target="_blank">
        {this.props.intl.formatMessage(messages['profile.viewMyRecords'])}
      </Hyperlink>
    );
  }

  // Inserted into the DOM in two places (for responsive layout)
  renderHeadingLockup() {
    const { username, dateJoined } = this.props;

    return (
      <React.Fragment>
        <h1 className="h2 mb-0 font-weight-bold">{username}</h1>
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
      <div className="row">
        <div className="col-md-4 col-lg-3">
          <StatusAlert alertType="danger" dialog={photoUploadError.userMessage} dismissible={false} open />
        </div>
      </div>
    );
  }

  renderAgeMessage() {
    const { requiresParentalConsent, isAuthenticatedUserProfile } = this.props;
    const shouldShowAgeMessage = requiresParentalConsent && isAuthenticatedUserProfile;

    if (!shouldShowAgeMessage) {
      return null;
    }
    return <AgeMessage accountSettingsUrl={this.props.configuration.ACCOUNT_SETTINGS_URL} />;
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
      languageProficiencies,
      visibilityLanguageProficiencies,
      visibilityCourseCertificates,
      bio,
      visibilityBio,
      requiresParentalConsent,
      isLoadingProfile,
    } = this.props;

    if (isLoadingProfile) {
      return <PageLoading />;
    }

    const commonFormProps = {
      openHandler: this.handleOpen,
      closeHandler: this.handleClose,
      submitHandler: this.handleSubmit,
      changeHandler: this.handleChange,
    };


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
                isEditable={this.props.isAuthenticatedUserProfile && !requiresParentalConsent}
              />
            </div>
          </div>
          <div className="col pl-0">
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
              levelOfEducation={levelOfEducation}
              visibilityLevelOfEducation={visibilityLevelOfEducation}
              formId="levelOfEducation"
              {...commonFormProps}
            />
            <SocialLinks
              socialLinks={socialLinks}
              draftSocialLinksByPlatform={draftSocialLinksByPlatform}
              visibilitySocialLinks={visibilitySocialLinks}
              formId="socialLinks"
              {...commonFormProps}
            />
          </div>
          <div className="pt-md-3 col-md-8 col-lg-7 offset-lg-1">
            {this.renderAgeMessage()}
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

ProfilePage.propTypes = {
  // Config
  configuration: PropTypes.shape({
    VIEW_MY_RECORDS_URL: PropTypes.string.isRequired,
    ACCOUNT_SETTINGS_URL: PropTypes.string.isRequired,
  }).isRequired,
  // Account data
  username: PropTypes.string,
  requiresParentalConsent: PropTypes.bool,
  dateJoined: PropTypes.string,
  isAuthenticatedUserProfile: PropTypes.bool.isRequired,

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
  levelOfEducation: null,
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
