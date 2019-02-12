import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'reactstrap';

import FullName from './FullName';
import UserLocation from './UserLocation';
import Education from './Education';
import Bio from './Bio';
import SocialLinks from './SocialLinks';
import MyCertificates from './MyCertificates';
import ProfileAvatar from './ProfileAvatar';

class UserAccount extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentlyEditingField: null,
    };

    this.onCancel = this.onCancel.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  onCancel() {
    this.setState({
      currentlyEditingField: null,
    });
  }

  onEdit(fieldName) {
    this.setState({
      currentlyEditingField: fieldName,
    });
  }

  onSave(fieldName, values) {
    const userAccountData = {};
    userAccountData[fieldName] = values[fieldName];
    this.props.saveUserProfile(this.props.username, userAccountData, values.visibility);
  }

  render() {
    const {
      saveState,
      error,
      bannerImage,
      profileImage,
      fullName,
      username,
      userLocation,
      education,
      socialLinks,
      bio,
      certificates,
    } = this.props;


    const commonProps = {
      onSave: this.onSave,
      onEdit: this.onEdit,
      onCancel: this.onCancel,
      saveState,
      error,
    };

    const getEditMode = (name) => {
      if (name === this.state.currentlyEditingField) return 'editing';
      return 'editable';
    };

    return (
      <div>
        <div
          style={{ backgroundImage: `url(${bannerImage})` }}
          className="bg-banner d-none d-md-block p-relative"
        />

        <Container fluid>
          <Row>
            <Col md={4} lg={3}>
              <div className="d-flex align-items-center d-md-block mt-4 mt-md-0">
                <ProfileAvatar
                  className="mb-md-3"
                  src={profileImage}
                  {...commonProps}
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
                name="fullName"
                mode={getEditMode('fullName')}
                fullName={fullName}
                visibility="Everyone"
                {...commonProps}
              />
              <UserLocation
                name="userLocation"
                mode={getEditMode('userLocation')}
                userLocation={userLocation}
                visibility="Everyone"
                {...commonProps}
              />
              <Education
                name="education"
                mode={getEditMode('education')}
                education={education}
                visibility="Everyone"
                {...commonProps}
              />
              <SocialLinks
                name="socialLinks"
                mode={getEditMode('socialLinks')}
                socialLinks={socialLinks}
                visibility="Everyone"
                {...commonProps}
              />
            </Col>
            <Col xs={{ order: 1 }} md={{ size: 8, order: 2 }} lg={{ size: 8, offset: 1 }} className="mt-4 mt-md-n5">
              <Bio
                name="bio"
                mode={getEditMode('bio')}
                bio={bio}
                visibility="Everyone"
                {...commonProps}
              />
              <MyCertificates certificates={certificates} />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default UserAccount;

UserAccount.propTypes = {
  saveState: PropTypes.oneOf([null, 'pending', 'complete', 'error']),
  error: PropTypes.string,
  bannerImage: PropTypes.string,
  profileImage: PropTypes.string,
  fullName: PropTypes.string,
  username: PropTypes.string,
  userLocation: PropTypes.string,
  education: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.string,
  }),
  socialLinks: PropTypes.shape({
    linkedIn: PropTypes.shape({
      title: PropTypes.string,
      url: PropTypes.string,
      display: PropTypes.string,
    }),
    twitter: PropTypes.shape({
      title: PropTypes.string,
      url: PropTypes.string,
      display: PropTypes.string,
    }),
    facebook: PropTypes.shape({
      title: PropTypes.string,
      url: PropTypes.string,
      display: PropTypes.string,
    }),
  }),
  aboutMe: PropTypes.string,
  bio: PropTypes.string,
  certificates: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
  })),
  saveUserProfile: PropTypes.func,
};

UserAccount.defaultProps = {
  saveState: null,
  error: null,
  bannerImage: 'https://source.unsplash.com/featured/1000x200/?colored,pattern',
  profileImage: 'https://source.unsplash.com/featured/200x200/?face',
  fullName: 'Hermione Granger',
  username: 'itslevioooosa20',
  userLocation: 'London, UK',
  education: {
    name: 'Bachelor’s Degree',
    value: 'b',
  },
  socialLinks: {
    linkedIn: {
      title: 'Linked In',
      url: 'https://www.linkedin.com/in/hermione-granger',
      display: 'https://www.linkedin.com/in/hermione-granger',
    },
    twitter: {
      title: 'Twitter',
      url: 'https://www.twitter.com/hermione_granger',
      display: 'https://www.twitter.com/hermione_granger',
    },
    facebook: {
      title: 'Facebook',
      url: 'http://facebook.com',
      display: 'http://facebook.com',
    },
  },
  aboutMe: 'These are some words about me and who I am as a person.',
  bio: 'These are some words about me and who I am as a person.',
  certificates: [{ title: 'Certificate 1' }, { title: 'Certificate 2' }, { title: 'Certificate 3' }],
  saveUserProfile: null,
};
