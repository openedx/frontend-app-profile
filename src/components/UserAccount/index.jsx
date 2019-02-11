import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'reactstrap';

import FullName from './FullName';
import UserLocation from './UserLocation';
import Education from './Education';
import Bio from './Bio';
import SocialLinks from './SocialLinks';
import MyCourses from './MyCourses';
import MyCertificates from './MyCertificates';
import Avatar from './Avatar';

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
    this.props.saveUserAccount(this.props.username, userAccountData, values.visibility);
  }

  render() {
    const {
      bannerImage,
      profileImage,
      fullName,
      username,
      userLocation,
      education,
      socialLinks,
      bio,
      certificates,
      courses,
    } = this.props;


    const commonProps = {
      onSave: this.onSave,
      onEdit: this.onEdit,
      onCancel: this.onCancel,
    };

    const isEditing = name => name === this.state.currentlyEditingField;

    const getEditMode = (name) => {
      if (name === this.state.currentlyEditingField) return 'editing';
      return 'editable';
    };

    const renderEducationAndSocial = () => (
      <React.Fragment>
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
      </React.Fragment>
    );

    return (
      <div>
        <div
          style={{ backgroundImage: `url(${bannerImage})` }}
          className="bg-banner d-none d-md-block p-relative"
        >
          <Container fluid>
            <Avatar
              src={profileImage}
              editMode={isEditing('avatar')}
              {...commonProps}
            />
          </Container>
        </div>

        <Container fluid className="pt-3">
          <Row>
            <Col md={4} lg={3}>
              <Row className="mb-3">
                <Col className="d-flex align-items-center d-md-block">
                  <div className="mr-3 d-md-none" style={{ flexBasis: '30%' }}>
                    <Avatar
                      src={profileImage}
                      editMode={isEditing('avatar')}
                      {...commonProps}
                    />
                  </div>
                  <div>
                    <h2 className="mb-0">{username}</h2>
                    <p>Member since 2017</p>

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
                  </div>
                </Col>
              </Row>
              <Row className="mb-3 d-none d-md-block">
                <Col>
                  {renderEducationAndSocial()}
                </Col>
              </Row>
            </Col>
            <Col md={8} lg={9} className="pt-md-1">
              <Bio
                name="bio"
                mode={getEditMode('bio')}
                bio={bio}
                visibility="Everyone"
                {...commonProps}
              />
              <div className="d-md-none">
                {renderEducationAndSocial()}
              </div>
              <MyCertificates certificates={certificates} />
              <MyCourses courses={courses} />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default UserAccount;

UserAccount.propTypes = {
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
  courses: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
  })),
  saveUserAccount: PropTypes.func,
};

UserAccount.defaultProps = {
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
  courses: [{ title: 'Course ' }, { title: 'Course 2' }, { title: 'Course 3' }],
  saveUserAccount: null,
};
