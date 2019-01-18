import React from 'react';
import { Hyperlink } from '@edx/paragon';
import {
  Container, Row, Col,
  Card, CardImg, CardBody, CardTitle,
} from 'reactstrap';

const certificates = [{ title: 'Certificate 1' }, { title: 'Certificate 2' }, { title: 'Certificate 3' }];
const courses = [{ title: 'Course ' }, { title: 'Course 2' }, { title: 'Course 3' }];

function renderEducationAndSocial() {
  return (
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
}

function UserAccount() {
  return (
    <Container fluid>
      <Row className="d-none d-md-block mb-3">
        <Col md={4}>
          <img className="mw-100 rounded-circle d-block" src="https://placeholdit.imgix.net/~text?txt=Avatar&w=120&h=120" alt="avatar" />
        </Col>
      </Row>
      <Row>
        <Col md={4} lg={3}>
          <Row className="mb-3">
            <Col className="d-flex align-items-center d-md-block">
              <div className="mr-3 d-md-none" style={{ flexBasis: '30%' }}>
                <img className="mw-100 rounded-circle d-block" src="https://placeholdit.imgix.net/~text?txt=Avatar&w=200&h=200" alt="avatar" />
              </div>
              <div>
                <h1 className="h2">Hermione Granger</h1>
                <ul className="list-unstyled mb-0">
                  <li>itslevioooosa20</li>
                  <li>Member since 2017</li>
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
        <Col md={8} lg={9}>

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
    </Container>
  );
}

export default UserAccount;
