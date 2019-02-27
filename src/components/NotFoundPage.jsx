import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

export default class NotFoundPage extends Component {
  componentDidMount() {}

  render() {
    return (
      <div>
        <FormattedMessage
          id="profile.notfound.message"
          defaultMessage="The page you're looking for is unavailable or there's an error in the URL. Please check the URL and try again."
          description="error message when a page does not exist"
        />
      </div>
    );
  }
}
