import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { FormattedMessage } from 'react-intl';

export default class NotFoundPage extends Component {
  componentDidMount() {}

  render() {
    return (
      <Container
        fluid
        className="d-flex py-5 justify-content-center align-items-start text-center"
      >
        <p
          className="my-0 py-5 text-muted"
          style={{ maxWidth: '32em' }}
        >
          <FormattedMessage
            id="profile.notfound.message"
            defaultMessage="The page you're looking for is unavailable or there's an error in the URL. Please check the URL and try again."
            description="error message when a page does not exist"
          />
        </p>
      </Container>
    );
  }
}
