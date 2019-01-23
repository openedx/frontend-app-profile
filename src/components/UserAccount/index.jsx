import React from 'react';
import { Icon, Hyperlink } from '@edx/paragon';
import {
  Container, Row, Col,
  Button, Input, Label,
  Card, CardImg, CardBody, CardTitle,
} from 'reactstrap';
import EditableContent from './EditableContent';

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
      aboutMe,
      bio,
      certificates,
      courses,
    } = this.props;


    const commonProps = {
      onSave: () => console.log("Save"),
      onEdit: this.onEdit,
      onCancel: this.onCancel,
    };
    const isEditing = (name) => name === this.state.currentlyEditingField;

    return (
      <div>
        <div
          style={{ backgroundImage: `url(${bannerImage})` }}
          className="bg-banner d-none d-md-block p-relative"
        >
          <Container fluid>
            <img className="avatar mw-100 p-absolute rounded-circle d-block" src={profileImage} alt="avatar" />
          </Container>
        </div>

        <Container fluid className="pt-3">
          <Row>
            <Col md={4} lg={3}>
              <Row className="mb-3">
                <Col className="d-flex align-items-center d-md-block">
                  <div className="mr-3 d-md-none" style={{ flexBasis: '30%' }}>
                    <img className="mw-100 rounded-circle d-block" src={profileImage} alt="avatar" />
                  </div>
                  <div>
                    <h1 className="h2 mb-0">{displayName}</h1>
                    <ul className="list-unstyled mb-0">
                      <li className="mb-2">{username}</li>
                      <li>{userLocation}</li>
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
                  <SocialLinks links={links} />
                </Col>
              </Row>
            </Col>
            <Col md={8} lg={9} className="pt-md-1">
              <Bio title={`About ${firstName}`} bio={bio} />
              <div className="d-md-none">
                <Education education={education} />
                <SocialLinks links={links} />
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

UserAccount.defaultProps = {
  bannerImage: 'https://source.unsplash.com/featured/1000x200/?colored,pattern',
  profileImage:'https://source.unsplash.com/featured/200x200/?face',
  displayName:'Hermione Granger',
  username:'itslevioooosa20',
  userLocation: 'London, UK',
  firstName:'Hermione',
  education:'Bachelor’s Degree',
  links: [
    {
      name: 'Linked In',
      url: 'https://www.linkedin.com/in/hermione-granger',
      display: 'https://www.linkedin.com/in/hermione-granger',
    },
    {
      name: 'Twitter',
      url: 'https://www.twitter.com/hermione_granger',
      display: 'https://www.twitter.com/hermione_granger',
    },
    {
      name: 'Peronsal Website',
      url: 'http://google.com',
      display: 'http://google.com',
    },
  ],
  aboutMe:'These are some words about me and who I am as a person.',
  bio:'These are some words about me and who I am as a person.',
  certificates:[{ title: 'Certificate 1' }, { title: 'Certificate 2' }, { title: 'Certificate 3' }],
  courses:[{ title: 'Course ' }, { title: 'Course 2' }, { title: 'Course 3' }],
};


function Editable(props) {
  return React.createElement(props.tag, {}, props.children);
}
Editable.defaultProps = {
  tag: 'div'
};

function Education(props) {
  const {
    education,
    editMode,
    onEdit,
    onCancel,
    onSave,
  } = props;

  return (
    <EditableContent
      isEditing={editMode}
      disabled={false}
      renderStatic={props => ( // eslint-disable-line no-unused-vars
        <React.Fragment>
          <h3>Education</h3>
          <p>{education}</p>
        </React.Fragment>
      )}
      renderEditable={props => ( // eslint-disable-line no-unused-vars
        <React.Fragment>
          <h3>Education <EditButton onClick={ () => onEdit('education') } /></h3>
          <Visibility to="Everyone" />
          <p>{education}</p>
        </React.Fragment>
      )}
      renderEditing={props => ( // eslint-disable-line no-unused-vars
        <React.Fragment>
          <h3>Education</h3>
          <Input defaultValue={education} type="textarea" name="text" id="exampleText" />
          <EditControls onCancel={onCancel} onSave={onSave} />
        </React.Fragment>
      )}
    />
  );
}

function SocialLinks(props) {
  const { links } = props;

  return (
    <React.Fragment>
      <h3>Social Links</h3>
      <dl>
        {links.map((link) => <React.Fragment>
          <dt>{link.name}</dt>
          <dd>
            
              <Hyperlink
                className="word-break-all"
                destination={link.url}
                content={link.display}
              />
            
          </dd>
        </React.Fragment>)}
      </dl>
    </React.Fragment>
  );
}

function Bio(props) {
  const {
    bio,
    title,
  } = props;

  return (
    <React.Fragment>
      <h3>{title}</h3>
      <p>{bio}</p>
    </React.Fragment>
  );
}


function MyCertificates(props) {
  const {
    certificates,
    mode,
  } = props;

  return (
    <React.Fragment>
      <h3>My Certificates</h3>
      <Row>
        {certificates.map(({ title }) => (
          <Col key={title} sm={6} lg={4}>
            <Card className="mb-4">
              <CardImg top src="https://placeholdit.imgix.net/~text?txt=Certificate&w=300&h=100" />
              <CardBody>
                <CardTitle>{title}</CardTitle>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </React.Fragment>
  )
}

function MyCourses(props) {
  const {
    courses,
    mode,
  } = props;

  return (
    <React.Fragment>
      <h3>My Courses</h3>
      <Row>
        {courses.map(({ title }) => (
          <Col key={title} sm={6} lg={4}>
            <Card className="mb-4">
              <CardImg top src="https://placeholdit.imgix.net/~text?txt=Certificate&w=300&h=100" />
              <CardBody>
                <CardTitle>{title}</CardTitle>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </React.Fragment>
  )
}


function EditButton({ onClick }) {
  return (
    <button className="btn btn-sm btn-link" onClick={onClick}>
      <Icon className="fa fa-pencil" /> Edit
    </button>
  )
}

function Visibility({ to }) {
  return (
    <span className="ml-auto small text-muted"><Icon className="fa fa-eye-slash" /> Everyone</span>
  );
}

function EditControls({ onCancel, onSave }) {
  return (
    <Row className="align-items-center">
      <Col className="mt-3 mb-3 flex-shrink-0">
        <Label className="d-inline-block mb-0 mr-2" size="sm" for="exampleSelect">Who can see this:</Label>
        <Input className="d-inline-block w-auto" bsSize="sm" type="select" name="select" id="exampleSelect">
          <option>Just me</option>
          <option>Everyone</option>
        </Input>
      </Col>
      <Col className="col-auto mt-3 mb-3">
        <Button color="link" onClick={onCancel}>Discard Changes</Button>
        <Button className="ml-2" color="primary" onClick={onSave}>Save Changes</Button>
      </Col>
    </Row>
  );
}