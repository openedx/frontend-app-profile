import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'reactstrap';

import ProfileAvatar from './ProfileAvatar';
import FullName from './FullName';
import UserLocation from './UserLocation';
import Education from './Education';
import SocialLinks from './SocialLinks';
import Bio from './Bio';
import MyCertificates from './MyCertificates';

class UserProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fullName: { value: null, visibility: null },
      userLocation: { value: null, visibility: null },
      education: { value: null, visibility: null },
      bio: { value: null, visibility: null },
      socialLinks: { value: null, visibility: null },
    };


    this.onCancel = this.onCancel.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onSaveProfilePhoto = this.onSaveProfilePhoto.bind(this);
    this.onDeleteProfilePhoto = this.onDeleteProfilePhoto.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onVisibilityChange = this.onVisibilityChange.bind(this);
  }

  componentDidMount() {
    this.props.fetchProfile(this.props.match.params.username);
  }

  onCancel() {
    this.props.closeEditableField(this.props.currentlyEditingField);
  }

  onEdit(fieldName) {
    this.props.openEditableField(fieldName);
  }

  onSave(fieldName, value, visibility) {
    const {
      value: fieldValue,
      visibility: fieldVisibility,
    } = this.state[fieldName];

    const valueToSave = value != null ? value : fieldValue;
    const visibilityToSave = visibility != null ? visibility : fieldVisibility;

    if (valueToSave != null) {
      this.props.saveProfile(
        this.props.username,
        {
          [fieldName]: valueToSave,
        },
        fieldName,
      );
    }

    if (visibilityToSave != null) {
      this.props.savePreferences(
        this.props.username,
        {
          visibility: {
            [fieldName]: visibilityToSave,
          },
        },
      );
    }

    if (valueToSave == null && visibilityToSave == null) {
      this.onCancel();
    }
  }

  onSaveProfilePhoto(formData) {
    this.props.saveProfilePhoto(this.props.username, formData);
  }

  onDeleteProfilePhoto() {
    this.props.deleteProfilePhoto(this.props.username);
  }

  onChange(fieldName, value) {
    this.setState({
      [fieldName]: {
        value,
        visibility: this.state[fieldName].visibility,
      },
    });
  }
  onVisibilityChange(fieldName, visibility) {
    this.setState({
      [fieldName]: {
        value: this.state[fieldName].value,
        visibility,
      },
    });
  }

  render() {
    const {
      saveState,
      error,
      profileImage,
      username,
      fullName,
      userLocation,
      bio,
      education,
      socialLinks,
      certificates,
      isCurrentUserProfile,
    } = this.props;

    const commonProps = {
      onSave: this.onSave,
      onEdit: this.onEdit,
      onCancel: this.onCancel,
      onChange: this.onChange,
      onVisibilityChange: this.onVisibilityChange,
      saveState,
      error,
    };

    const getMode = (name) => {
      // If the prop doesn't exist, that means it hasn't been set (for the current user's profile)
      // or is being hidden from us (for other users' profiles)
      const propExists = this.props[name] != null && this.props[name].length > 0;

      // If this isn't the current user's profile...
      if (!isCurrentUserProfile) {
        // then there are only two options: static or nothing.
        // We use 'null' as a return value because the consumers of
        // getMode render nothing at all on a mode of null.
        return propExists ? 'static' : null;
      }
      // Otherwise, if this is the current user's profile...
      if (name === this.props.currentlyEditingField) {
        return 'editing';
      }

      if (!propExists) {
        return 'empty';
      }

      return 'editable';
    };

    const getVisibility = name => this.props.visibility[name];

    return (
      <div>
        <div className="bg-banner bg-program-micro-masters d-none d-md-block p-relative" />
        <Container fluid>
          <Row>
            <Col md={4} lg={3}>
              <div className="d-flex align-items-center d-md-block mt-4 mt-md-0">
                <ProfileAvatar
                  className="mb-md-3"
                  src={profileImage}
                  onSave={this.onSaveProfilePhoto}
                  onDelete={this.onDeleteProfilePhoto}
                  savePhotoState={this.props.savePhotoState}
                />
                <div>
                  <h2 className="mb-0">{username}</h2>
                  <p className="mb-0">Member since 2017</p>
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs={{ order: 2 }} md={{ size: 4, order: 1 }} lg={3} className="mt-md-4">

              <FullName
                fullName={fullName}
                visibility={getVisibility('fullName')}
                editMode={getMode('fullName')}
                {...commonProps}
              />

              <UserLocation
                userLocation={userLocation}
                visibility={getVisibility('userLocation')}
                editMode={getMode('userLocation')}
                {...commonProps}
              />

              <Education
                education={education}
                visibility={getVisibility('education')}
                editMode={getMode('education')}
                {...commonProps}
              />

              <SocialLinks
                socialLinks={socialLinks}
                visibility={getVisibility('socialLinks')}
                editMode={getMode('socialLinks')}
                {...commonProps}
              />

            </Col>
            <Col xs={{ order: 1 }} md={{ size: 8, order: 2 }} lg={{ size: 8, offset: 1 }} className="mt-4 mt-md-n5">

              <Bio
                bio={bio}
                visibility={getVisibility('bio')}
                editMode={getMode('bio')}
                {...commonProps}
              />

              <MyCertificates
                certificates={certificates}
                visibility={getVisibility('certificates')}
                editMode={getMode('certificates')}
                {...commonProps}
              />

            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default UserProfile;

UserProfile.propTypes = {
  currentlyEditingField: PropTypes.string,
  saveState: PropTypes.oneOf([null, 'pending', 'complete', 'error']),
  savePhotoState: PropTypes.oneOf([null, 'pending', 'complete', 'error']),
  error: PropTypes.string,
  isCurrentUserProfile: PropTypes.bool.isRequired,
  profileImage: PropTypes.string,
  fullName: PropTypes.string,
  username: PropTypes.string,
  userLocation: PropTypes.string,
  education: PropTypes.string,
  socialLinks: PropTypes.arrayOf(PropTypes.shape({
    platform: PropTypes.string,
    socialLink: PropTypes.string,
  })),
  aboutMe: PropTypes.string,
  bio: PropTypes.string,
  certificates: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
  })),
  fetchProfile: PropTypes.func.isRequired,
  saveProfile: PropTypes.func.isRequired,
  saveProfilePhoto: PropTypes.func.isRequired,
  deleteProfilePhoto: PropTypes.func.isRequired,
  openEditableField: PropTypes.func.isRequired,
  closeEditableField: PropTypes.func.isRequired,
  savePreferences: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      username: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  accountPrivacy: PropTypes.string,
  visibility: PropTypes.object, // eslint-disable-line
};

UserProfile.defaultProps = {
  currentlyEditingField: null,
  saveState: null,
  savePhotoState: null,
  error: null,
  profileImage: null,
  fullName: null,
  username: null,
  userLocation: null,
  education: null,
  socialLinks: [],
  aboutMe: null,
  bio: null,
  certificates: null,
  accountPrivacy: null,
  visibility: {}, // eslint-disable-line
};
