import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col, Input, Card, CardBody, CardTitle } from 'reactstrap';

import EditControls from './elements/EditControls';
import EditableItemHeader from './elements/EditableItemHeader';
import EmptyContent from './elements/EmptyContent';
import SwitchContent from './elements/SwitchContent';
import ProfileAvatar from './ProfileAvatar';
import SocialLinks from './SocialLinks';

import { ALL_COUNTRIES } from '../../constants/countries';
import EDUCATION from '../../constants/education';


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
    this.onChange = this.onChange.bind(this);
    this.onVisibilityChange = this.onVisibilityChange.bind(this);
  }

  onCancel() {
    this.props.closeEditableField(this.props.currentlyEditingField);
  }

  onEdit(fieldName) {
    this.props.openEditableField(fieldName);
  }

  onSave(fieldName, value) {
    const userAccountData = {
      [fieldName]: value || this.state[fieldName].value,
    };
    this.props.saveUserProfile(this.props.username, userAccountData, 'Everyone', fieldName);
  }

  onSaveProfilePhoto(formData) {
    this.props.saveUserProfilePhoto(this.props.username, formData);
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


    const getEditMode = (name) => {
      if (name === this.props.currentlyEditingField) return 'editing';
      return 'editable';
    };

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
                editMode={getEditMode('fullName')}
                {...commonProps}
              />

              <UserLocation
                userLocation={userLocation}
                editMode={getEditMode('userLocation')}
                {...commonProps}
              />

              <Education
                education={education}
                editMode={getEditMode('education')}
                {...commonProps}
              />

              <SocialLinks
                socialLinks={socialLinks}
                editMode={getEditMode('socialLinks')}
                {...commonProps}
              />

            </Col>
            <Col xs={{ order: 1 }} md={{ size: 8, order: 2 }} lg={{ size: 8, offset: 1 }} className="mt-4 mt-md-n5">

              <Bio
                bio={bio}
                editMode={getEditMode('bio')}
                {...commonProps}
              />

              <MyCertificates
                certificates={certificates}
                editMode={getEditMode('certificates')}
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
  saveUserProfile: PropTypes.func,
  saveUserProfilePhoto: PropTypes.func.isRequired,
  openEditableField: PropTypes.func.isRequired,
  closeEditableField: PropTypes.func.isRequired,
};

UserProfile.defaultProps = {
  currentlyEditingField: null,
  saveState: null,
  savePhotoState: null,
  error: null,
  profileImage: 'https://source.unsplash.com/featured/200x200/?face',
  fullName: 'Hermione Granger',
  username: 'itslevioooosa20',
  userLocation: 'London, UK',
  education: null,
  socialLinks: [],
  aboutMe: 'These are some words about me and who I am as a person.',
  bio: 'These are some words about me and who I am as a person.',
  certificates: [{ title: 'Certificate 1' }, { title: 'Certificate 2' }, { title: 'Certificate 3' }],
  saveUserProfile: null,
};


const sectionPropTypes = {
  editMode: PropTypes.string,
  onEdit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onVisibilityChange: PropTypes.func.isRequired,
  saveState: PropTypes.string,
};

const sectionDefaultProps = {
  editMode: 'static',
  saveState: null,
};


function FullName({
  fullName,
  editMode,
  onEdit,
  onChange,
  onSave,
  onCancel,
  onVisibilityChange,
  saveState,
}) {
  return (
    <SwitchContent
      className="mb-4"
      expression={editMode}
      cases={{
        editing: (
          <React.Fragment>
            <EditableItemHeader content="Full Name" />
            <Input
              type="text"
              name="fullName"
              defaultValue={fullName}
              onChange={e => onChange('fullName', e.target.value)}
            />
            <EditControls
              onCancel={() => onCancel('fullName')}
              onSave={() => onSave('fullName')}
              saveState={saveState}
              visibility="Everyone"
              onVisibilityChange={e => onVisibilityChange('fullName', e.target.value)}
            />
          </React.Fragment>
        ),
        editable: (
          <React.Fragment>
            <EditableItemHeader
              content="Full Name"
              showEditButton
              onClickEdit={() => onEdit('fullName')}
              showVisibility={Boolean(fullName)}
              visibility="Everyone"
            />
            {fullName ? (
              <h5>{fullName}</h5>
            ) : (
              <EmptyContent onClick={() => onEdit('fullName')}>Add name</EmptyContent>
            )}
          </React.Fragment>
        ),
        static: (
          <React.Fragment>
            <EditableItemHeader content="Full Name" />
            <h5>{fullName}</h5>
          </React.Fragment>
        ),
      }}
    />
  );
}

FullName.propTypes = {
  ...sectionPropTypes,
  fullName: PropTypes.string,
};

FullName.defaultProps = {
  ...sectionDefaultProps,
  fullName: null,
};


function UserLocation({
  userLocation,
  editMode,
  onEdit,
  onChange,
  onSave,
  onCancel,
  onVisibilityChange,
  saveState,
}) {
  return (
    <SwitchContent
      className="mb-4"
      expression={editMode}
      cases={{
        editing: (
          <React.Fragment>
            <EditableItemHeader content="Location" />
            <Input
              type="select"
              name="userLocation"
              className="w-100"
              defaultValue={userLocation}
              onChange={e => onChange('userLocation', e.target.value)}
            >
              {Object.keys(ALL_COUNTRIES).map(key => (
                <option key={key} value={key}>{ALL_COUNTRIES[key]}</option>
              ))}
            </Input>
            <EditControls
              onCancel={() => onCancel('userLocation')}
              onSave={() => onSave('userLocation')}
              saveState={saveState}
              visibility="Everyone"
              onVisibilityChange={e => onVisibilityChange('userLocation', e.target.value)}
            />
          </React.Fragment>
        ),
        editable: (
          <React.Fragment>
            <EditableItemHeader
              content="Location"
              showEditButton
              onClickEdit={() => onEdit('userLocation')}
              showVisibility={Boolean(userLocation)}
              visibility="Everyone"
            />
            {userLocation ? (
              <h5>{ALL_COUNTRIES[userLocation]}</h5>
            ) : (
              <EmptyContent onClick={() => onEdit('userLocation')}>Add location</EmptyContent>
            )}
          </React.Fragment>
        ),
        static: (
          <React.Fragment>
            <EditableItemHeader content="Location" />
            <h5>{ALL_COUNTRIES[userLocation]}</h5>
          </React.Fragment>
        ),
      }}
    />
  );
}

UserLocation.propTypes = {
  ...sectionPropTypes,
  userLocation: PropTypes.string,
};

UserLocation.defaultProps = {
  ...sectionDefaultProps,
  userLocation: null,
};


function Education({
  education,
  editMode,
  onEdit,
  onChange,
  onSave,
  onCancel,
  onVisibilityChange,
  saveState,
}) {
  return (
    <SwitchContent
      className="mb-4"
      expression={editMode}
      cases={{
        editing: (
          <React.Fragment>
            <EditableItemHeader content="Education" />
            <Input
              type="select"
              name="education"
              className="w-100"
              defaultValue={education}
              onChange={e => onChange('education', e.target.value)}
            >
              {Object.keys(EDUCATION).map(key => (
                <option key={key} value={key}>{EDUCATION[key]}</option>
              ))}
            </Input>
            <EditControls
              onCancel={() => onCancel('education')}
              onSave={() => onSave('education')}
              saveState={saveState}
              visibility="Everyone"
              onVisibilityChange={e => onVisibilityChange('education', e.target.value)}
            />
          </React.Fragment>
        ),
        editable: (
          <React.Fragment>
            <EditableItemHeader
              content="Education"
              showEditButton
              onClickEdit={() => onEdit('education')}
              showVisibility={Boolean(education)}
              visibility="Everyone"
            />
            {education ? (
              <h5>{EDUCATION[education]}</h5>
            ) : (
              <EmptyContent onClick={() => onEdit('education')}>Add education</EmptyContent>
            )}
          </React.Fragment>
        ),
        static: (
          <React.Fragment>
            <EditableItemHeader content="Education" />
            <h5>{EDUCATION[education]}</h5>
          </React.Fragment>
        ),
      }}
    />
  );
}

Education.propTypes = {
  ...sectionPropTypes,
  education: PropTypes.string,
};

Education.defaultProps = {
  ...sectionDefaultProps,
  education: null,
};


function Bio({
  bio,
  editMode,
  onEdit,
  onChange,
  onSave,
  onCancel,
  onVisibilityChange,
  saveState,
}) {
  return (
    <SwitchContent
      className="mb-4"
      expression={editMode}
      cases={{
        editing: (
          <React.Fragment>
            <EditableItemHeader content="About Me" />
            <Input
              type="textarea"
              name="bio"
              defaultValue={bio}
              onChange={e => onChange('bio', e.target.value)}
            />
            <EditControls
              onCancel={() => onCancel('bio')}
              onSave={() => onSave('bio')}
              saveState={saveState}
              visibility="Everyone"
              onVisibilityChange={e => onVisibilityChange('bio', e.target.value)}
            />
          </React.Fragment>
        ),
        editable: (
          <React.Fragment>
            <EditableItemHeader
              content="About Me"
              showEditButton
              onClickEdit={() => onEdit('bio')}
              showVisibility={Boolean(bio)}
              visibility="Everyone"
            />
            {bio ? (
              <p className="lead">{bio}</p>
            ) : (
              <EmptyContent onClick={() => onEdit('bio')}>Tell other learners a little about yourself...</EmptyContent>
            )}
          </React.Fragment>
        ),
        static: (
          <React.Fragment>
            <EditableItemHeader content="About Me" />
            <p className="lead">{bio}</p>,
          </React.Fragment>
        ),
      }}
    />
  );
}

Bio.propTypes = {
  ...sectionPropTypes,
  bio: PropTypes.string,
};

Bio.defaultProps = {
  ...sectionDefaultProps,
  bio: null,
};


function MyCertificates({
  certificates,
  editMode,
  onEdit,
  onSave,
  onCancel,
  onVisibilityChange,
  saveState,
}) {
  const renderCertificates = () => {
    if (!certificates) {
      return <EmptyContent onClick={() => onEdit('certificates')}>You don&quot;t have any certificates yet.</EmptyContent>;
    }

    return (
      <Row>
        {certificates.map(({ title }) => (
          <Col key={title} sm={6}>
            <Card className="mb-4">
              <CardBody>
                <CardTitle>{title}</CardTitle>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    );
  };

  return (
    <SwitchContent
      className="mb-4"
      expression={editMode}
      cases={{
        editing: (
          <React.Fragment>
            <EditableItemHeader content="My Certificates" />
            {renderCertificates()}
            <EditControls
              onCancel={() => onCancel('certificates')}
              onSave={() => onSave('certificates')}
              saveState={saveState}
              visibility="Everyone"
              onVisibilityChange={e => onVisibilityChange('certificates', e.target.value)}
            />
          </React.Fragment>
        ),
        editable: (
          <React.Fragment>
            <EditableItemHeader
              content="My Certificates"
              showEditButton
              onClickEdit={() => onEdit('certificates')}
              showVisibility={Boolean(certificates)}
              visibility="Everyone"
            />
            {renderCertificates()}
          </React.Fragment>
        ),
        static: (
          <React.Fragment>
            <EditableItemHeader content="My Certificates" />
            {renderCertificates()}
          </React.Fragment>
        ),
      }}
    />
  );
}

MyCertificates.propTypes = {
  ...sectionPropTypes,
  certificates: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
  })),
};

MyCertificates.defaultProps = {
  ...sectionDefaultProps,
  certificates: null,
};
