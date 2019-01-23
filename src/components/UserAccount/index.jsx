import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'reactstrap';

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

  render() {
    const {
      bannerImage,
      profileImage,
      displayName,
      username,
      userLocation,
      firstName,
      education,
      links,
      bio,
      certificates,
      courses,
    } = this.props;


    const commonProps = {
      onSave: () => { /* Save */ },
      onEdit: this.onEdit,
      onCancel: this.onCancel,
    };

    const isEditing = name => name === this.state.currentlyEditingField;

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
                    <h1 className="h2 mb-0">{displayName}</h1>
                    <ul className="list-unstyled mb-0">
                      <li className="mb-2">{username}</li>
                      <UserLocation
                        userLocation={userLocation}
                        editMode={isEditing('userLocation')}
                        {...commonProps}
                      />
                    </ul>
                  </div>
                </Col>
              </Row>
              <Row className="mb-3 d-none d-md-block">
                <Col>
                  <Education
                    education={education}
                    editMode={isEditing('education')}
                    {...commonProps}
                  />
                  <SocialLinks
                    links={links}
                    editMode={isEditing('socialLinks')}
                    {...commonProps}
                  />
                </Col>
              </Row>
            </Col>
            <Col md={8} lg={9} className="pt-md-1">
              <Bio
                title={`About ${firstName}`}
                bio={bio}
                editMode={isEditing('bio')}
                {...commonProps}
              />
              <div className="d-md-none">
                <Education
                  education={education}
                  editMode={isEditing('education')}
                  {...commonProps}
                />
                <SocialLinks
                  links={links}
                  editMode={isEditing('socialLinks')}
                  {...commonProps}
                />
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
  displayName: PropTypes.string,
  username: PropTypes.string,
  userLocation: PropTypes.string,
  firstName: PropTypes.string,
  education: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.string,
  }),
  links: PropTypes.shape({
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
  certificates: PropTypes.shape([
    PropTypes.shape({
      title: PropTypes.string,
    }),
  ]),
  courses: PropTypes.shape([
    PropTypes.shape({
      title: PropTypes.string,
    }),
  ]),
};

UserAccount.defaultProps = {
  bannerImage: 'https://source.unsplash.com/featured/1000x200/?colored,pattern',
  profileImage: 'https://source.unsplash.com/featured/200x200/?face',
  displayName: 'Hermione Granger',
  username: 'itslevioooosa20',
  userLocation: 'London, UK',
  firstName: 'Hermione',
  education: {
    name: 'Bachelor’s Degree',
    value: 'b',
  },
  links: {
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
};
