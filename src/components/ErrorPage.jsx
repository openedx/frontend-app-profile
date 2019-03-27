import React, { Component } from 'react';
import { Button, Col, Container, Row } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import apiClient from '../config/apiClient';

export default class ErrorPage extends Component {
  componentDidMount() {}

  render() {
    const { username } = apiClient.getAuthenticationState().authentication;

    return (
      <Container
        fluid
        className="py-5 justify-content-center align-items-start text-center"
      >
        <Row>
          <Col>
            <p className="my-0 py-5 text-muted">
              <FormattedMessage
                id="profile.error.message.text"
                defaultMessage="An unexpected error occurred. Please click the button below to return to your profile and try again."
                description="error message when an unexpected error occurs"
              />
            </p>
          </Col>
        </Row>
        <Row>
          <Col>
            <Link to={`/u/${username}`}>
              <Button color="primary">
                <FormattedMessage
                  id="profile.error.button.text"
                  defaultMessage="Return to Your Profile"
                  description="text for button that navigates back to your profile page after an error has occured"
                />
              </Button>
            </Link>
          </Col>
        </Row>
      </Container>
    );
  }
}
