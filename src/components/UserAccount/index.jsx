import React from 'react';
import { Icon, Hyperlink } from '@edx/paragon';
import {
  Container, Row, Col,
  Button,
  FormGroup, Input, Label,
  Card, CardImg, CardBody, CardTitle,
} from 'reactstrap';


class UserAccount extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      getTheLinterOffMyBack: true,
    };
  }

  render() {
    const bannerImage = 'https://source.unsplash.com/featured/1000x200/?colored,pattern';
    const profileImage = 'https://source.unsplash.com/featured/200x200/?face';
    const displayName = 'Hermione Granger';
    const username = 'itslevioooosa20';
    const location = 'London, UK';
    const firstName = 'Hermione'; // How can we get the first name in an 18n friendly way?

    const education = 'Bachelor’s Degree';
    const linkedin = {
      url: 'https://www.linkedin.com/in/hermione-granger',
      display: 'https://www.linkedin.com/in/hermione-granger',
    };
    const twitter = {
      url: 'https://www.twitter.com/hermione_granger',
      display: 'https://www.twitter.com/hermione_granger',
    };
    const personalWebsite = 'http://google.com';

    const aboutMe = 'These are some words about me and who I am as a person.';
    const certificates = [{ title: 'Certificate 1' }, { title: 'Certificate 2' }, { title: 'Certificate 3' }];
    const courses = [{ title: 'Course ' }, { title: 'Course 2' }, { title: 'Course 3' }];


    const renderEducationAndSocial = () => (
      <React.Fragment>
        <h3>Education</h3>
        <p>{education}</p>

        <h3>Social Links</h3>
        <dl>
          <dt>Linked In</dt>
          <dd>
            <Hyperlink
              className="word-break-all"
              destination={linkedin.url}
              content={linkedin.display}
            />
          </dd>

          <dt>Twitter</dt>
          <dd>
            <Hyperlink
              className="word-break-all"
              destination={twitter.url}
              content={twitter.display}
            />
          </dd>

          <dt>Personal Website</dt>
          <dd>
            <Hyperlink
              className="word-break-all"
              destination={personalWebsite}
              content={personalWebsite}
            />
          </dd>
        </dl>
      </React.Fragment>
    );

    return (
      <div>
        <div
          style={{
            backgroundImage: `url(${bannerImage})`,
          }}
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
                      <li>{location}</li>
                    </ul>
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

              <h3>About {firstName}</h3>
              <p>{aboutMe}</p>

              <div className="d-md-none">
                {renderEducationAndSocial()}
              </div>

              <h3>My Certificates</h3>
              <Row>
                {certificates.map(({ title }) => (
                  <Col sm={6} lg={4}>
                    <Card className="mb-4">
                      <CardImg top src="https://placeholdit.imgix.net/~text?txt=Certificate&w=300&h=100" />
                      <CardBody>
                        <CardTitle>{title}</CardTitle>
                      </CardBody>
                    </Card>
                  </Col>
                ))}
              </Row>

              <h3>Courses I’ve Taken</h3>
              <Row>
                {courses.map(({ title }) => (
                  <Col sm={6} lg={4}>
                    <Card className="mb-4">
                      <CardImg top src="https://placeholdit.imgix.net/~text?txt=Certificate&w=300&h=100" />
                      <CardBody>
                        <CardTitle>{title}</CardTitle>
                      </CardBody>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>

          <h1>Utils for later</h1>
          <p>{this.state.getTheLinterOffMyBack}</p>

          <FormGroup>
            <Label className="d-inline-block mr-2" size="sm" for="exampleSelect">Who can see this:</Label>
            <Input className="d-inline-block w-auto" size="sm" type="select" name="select" id="exampleSelect">
              <option>Just me</option>
              <option>Everyone</option>
            </Input>
          </FormGroup>
          <div>
            <span className="small"><Icon className="fa fa-eye-slash" /> Everyone</span>
            <span className="small"><Icon className="fa fa-eye" /> Just me</span>
          </div>
          <div>
            <Button color="link">Discard Changes</Button>
            <Button className="ml-2" color="primary">Save Changes</Button>
          </div>
        </Container>
      </div>
    );
  }
}

export default UserAccount;
