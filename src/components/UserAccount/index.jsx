import React from 'react';
import { Icon, Hyperlink } from '@edx/paragon';
import {
  Container, Row, Col,
  Button,
  FormGroup, Input, Label,
  Card, CardImg, CardBody, CardTitle,
} from 'reactstrap';


function UserAccount() {
  const certificates = [{ title: 'Certificate 1' }, { title: 'Certificate 2' }, { title: 'Certificate 3' }];
  const courses = [{ title: 'Course ' }, { title: 'Course 2' }, { title: 'Course 3' }];

  const renderEducationAndSocial = () => (
    <React.Fragment>
      <h3>Education</h3>
      <p>Bachelor’s Degree</p>

      <h3>Social Links</h3>
      <dl>
        <dt>Linked In</dt>
        <dd>
          <Hyperlink
            className="word-break-all"
            destination="https://www.linkedin.com/in/hermione-granger"
            content="https://www.linkedin.com/in/hermione-granger"
          />
        </dd>

        <dt>Twitter</dt>
        <dd>
          <Hyperlink
            className="word-break-all"
            destination="https://www.twitter.com/hermione_granger"
            content="https://www.twitter.com/hermione_granger"
          />
        </dd>

        <dt>Personal Website</dt>
        <dd>
          <Hyperlink
            className="word-break-all"
            destination="http://www.google.com"
            content="www.google.com"
          />
        </dd>
      </dl>
    </React.Fragment>
  );


  return (
    <div>
      <div
        style={{
          backgroundImage: 'url(https://source.unsplash.com/featured/1000x200/?colored,pattern)',
        }}
        className="bg-banner d-none d-md-block p-relative"
      >
        <Container fluid>
          <img className="avatar mw-100 p-absolute rounded-circle d-block" src="https://source.unsplash.com/featured/200x200/?face" alt="avatar" />
        </Container>
      </div>

      <Container fluid className="pt-3">
        <Row>
          <Col md={4} lg={3}>
            <Row className="mb-3">
              <Col className="d-flex align-items-center d-md-block">
                <div className="mr-3 d-md-none" style={{ flexBasis: '30%' }}>
                  <img className="mw-100 rounded-circle d-block" src="https://source.unsplash.com/featured/200x200/?face" alt="avatar" />
                </div>
                <div>
                  <h1 className="h2 mb-0">Hermione Granger</h1>
                  <ul className="list-unstyled mb-0">
                    <li className="mb-2">itslevioooosa20</li>
                    <li>London, UK</li>
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

            <h3>About Hermione</h3>
            <p>These are some words about me and who I am as a person.</p>

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

export default UserAccount;
