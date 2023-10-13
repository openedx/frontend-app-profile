/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { ensureConfig } from '@edx/frontend-platform';
import { AppContext } from '@edx/frontend-platform/react';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faFacebook, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { ActionRow, Avatar, Card } from '@edx/paragon';
import get from 'lodash.get';
import Country from './forms/Country';

import EditableItemHeader from './forms/elements/EditableItemHeader';
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
import Bio from './forms/Bio';
import DateJoined from './DateJoined';
import PageLoading from './PageLoading';

// Selectors
import { profilePageSelector } from './data/selectors';

// i18n
import messages from './ProfilePage.messages';
import eduMessages from './forms/Education.messages';
import countryMessages from './forms/Country.messages';

import withParams from '../utils/hoc';

ensureConfig(['CREDENTIALS_BASE_URL', 'LMS_BASE_URL'], 'ProfilePage');

// eslint-disable-next-line react/function-component-definition
function Fallback() {
  return (
    <div>this is broken as all get</div>
  );
}

const platformDisplayInfo = {
  facebook: {
    icon: faFacebook,
    name: '',
  },
  twitter: {
    icon: faTwitter,
    name: '',
  },
  linkedin: {
    icon: faLinkedin,
    name: '',
  },
};

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

  renderContent() {
    const {
      profileImage,
      country,
      levelOfEducation,
      socialLinks,
      bio,
      visibilityBio,
      visibilityCountry,
      isLoadingProfile,
      dateJoined,
      intl,
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
      <Plugin fallbackComponent={<Fallback />}>
        <Card className="mb-2">
          <Card.Header
            actions={
              (
                <ActionRow>
                  <ul className="list-unstyled">
                    {socialLinks
                      .filter(({ socialLink }) => Boolean(socialLink))
                      .map(({ platform, socialLink }) => (
                        <StaticListItem
                          key={platform}
                          name={platformDisplayInfo[platform].name}
                          url={socialLink}
                          platform={platform}
                        />
                      ))}
                  </ul>
                </ActionRow>
              )
            }
          />
          <div className="container-fluid">
            <div className="row align-items-center pt-4 mb-4 pt-md-0 mb-md-0">
              <div className="col-auto col-md-4 col-lg-3">
                <div className="d-flex align-items-center d-md-block">
                  <Avatar
                    size="lg"
                    src={profileImage.src}
                    alt="Profile image"
                  />
                </div>
                <div className="d-flex align-items-center d-md-block">
                  <h1 className="h2 mb-0 font-weight-bold">{this.props.params.username}</h1>
                </div>
                <DateJoined date={dateJoined} />
              </div>
            </div>
            <div className="row">
              <div className="col-md-4 col-lg-4">
                <Country
                  country={country}
                  visibilityCountry={visibilityCountry}
                  formId="country"
                  {...commonFormProps}
                />
                <p data-hj-suppress className="h5">
                  {intl.formatMessage(get(
                    eduMessages,
                    `profile.education.levels.${levelOfEducation}`,
                    eduMessages['profile.education.levels.o'],
                  ))}
                </p>
                <Bio
                  bio={bio}
                  visibilityBio={visibilityBio}
                  formId="bio"
                  {...commonFormProps}
                />
              </div>
            </div>
          </div>
        </Card>
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

const SocialLink = ({ url, name, platform }) => (
  <a href={url} className="font-weight-bold">
    <FontAwesomeIcon className="mr-2" icon={platformDisplayInfo[platform].icon} />
    {name}
  </a>
);

const StaticListItem = ({ url, name, platform }) => (
  <li className="mb-2">
    <SocialLink name={name} url={url} platform={platform} />
  </li>
);

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
