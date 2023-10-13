import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { ensureConfig } from '@edx/frontend-platform';
import { AppContext, ErrorBoundary } from '@edx/frontend-platform/react';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Plugin } from '../../plugins';

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
import Education from './forms/Education';
import SocialLinks from './forms/SocialLinks';
import Bio from './forms/Bio';
import DateJoined from './DateJoined';
import PageLoading from './PageLoading';

// Selectors
import { profilePageSelector } from './data/selectors';

// i18n
import messages from './ProfilePage.messages';

import withParams from '../utils/hoc';

ensureConfig(['CREDENTIALS_BASE_URL', 'LMS_BASE_URL'], 'ProfilePage');

// eslint-disable-next-line react/function-component-definition
function Fallback() {
  return (
    <div>this is broken as all get</div>
  );
}

class ProfilePluginPage extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleSaveProfilePhoto = this.handleSaveProfilePhoto.bind(this);
    this.handleDeleteProfilePhoto = this.handleDeleteProfilePhoto.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.props.fetchProfile(this.props.params.username);
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

  // Inserted into the DOM in two places (for responsive layout)
  renderHeadingLockup() {
    const { dateJoined } = this.props;
    return (
      <ErrorBoundary fallbackComponent={<Fallback />}>
        <span data-hj-suppress>
          <h1 className="h2 mb-0 font-weight-bold">{this.props.params.username}</h1>
          <DateJoined date={dateJoined} />
          <hr className="d-none d-md-block" />
        </span>
      </ErrorBoundary>
    );
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
      visibilitySocialLinks,
      bio,
      visibilityBio,
      isLoadingProfile,
    } = this.props;

    if (isLoadingProfile) {
      return <PageLoading srMessage={this.props.intl.formatMessage(messages['profile.loading'])} />;
    }

    const commonFormProps = {
      openHandler: this.handleOpen,
      closeHandler: this.handleClose,
      submitHandler: this.handleSubmit,
      changeHandler: this.handleChange,
    };

    return (
      <Plugin>
        <div className="container-fluid">
          <div className="row align-items-center pt-4 mb-4 pt-md-0 mb-md-0">
            <div className="col-auto col-md-4 col-lg-3">
              <div className="d-flex align-items-center d-md-block">
                <ProfileAvatar
                  className="mb-md-3"
                  src={profileImage.src}
                  isDefault={profileImage.isDefault}
                />
              </div>
            </div>
            <div className="col pl-0">
              <div>
                {this.renderHeadingLockup()}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 col-lg-4">
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
              <Education
                levelOfEducation={levelOfEducation}
                visibilityLevelOfEducation={visibilityLevelOfEducation}
                formId="levelOfEducation"
                {...commonFormProps}
              />
              <SocialLinks
                socialLinks={socialLinks}
                visibilitySocialLinks={visibilitySocialLinks}
                formId="socialLinks"
                {...commonFormProps}
              />
            </div>
            <div className="pt-md-3 col-md-8 col-lg-7 offset-lg-1">
              <Bio
                bio={bio}
                visibilityBio={visibilityBio}
                formId="bio"
                {...commonFormProps}
              />
            </div>
          </div>
        </div>
      </Plugin>
    );
  }

  render() {
    return (
      <div className="profile-page">
        {this.renderContent()}
      </div>
    );
  }
}

ProfilePluginPage.contextType = AppContext;

ProfilePluginPage.propTypes = {
  // Account data
  dateJoined: PropTypes.string,

  // Bio form data
  bio: PropTypes.string,
  yearOfBirth: PropTypes.number,
  visibilityBio: PropTypes.string.isRequired,

  // Country form data
  country: PropTypes.string,
  visibilityCountry: PropTypes.string.isRequired,

  // Education form data
  levelOfEducation: PropTypes.string,
  visibilityLevelOfEducation: PropTypes.string.isRequired,

  // Name form data
  name: PropTypes.string,
  visibilityName: PropTypes.string.isRequired,

  // Social links form data
  socialLinks: PropTypes.arrayOf(PropTypes.shape({
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
  isLoadingProfile: PropTypes.bool.isRequired,

  // Actions
  fetchProfile: PropTypes.func.isRequired,
  saveProfile: PropTypes.func.isRequired,
  saveProfilePhoto: PropTypes.func.isRequired,
  deleteProfilePhoto: PropTypes.func.isRequired,
  openForm: PropTypes.func.isRequired,
  closeForm: PropTypes.func.isRequired,
  updateDraft: PropTypes.func.isRequired,

  // Router
  params: PropTypes.shape({
    username: PropTypes.string.isRequired,
  }).isRequired,

  // i18n
  intl: intlShape.isRequired,
};

ProfilePluginPage.defaultProps = {
  saveState: null,
  profileImage: {},
  name: null,
  yearOfBirth: null,
  levelOfEducation: null,
  country: null,
  socialLinks: [],
  bio: null,
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
)(injectIntl(withParams(ProfilePluginPage)));
