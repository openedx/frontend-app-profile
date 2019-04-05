import React, { Component } from 'react';
import { Button } from '@edx/paragon';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import apiClient from '../config/apiClient';

export default class ErrorPage extends Component {
  componentDidMount() {}

  render() {
    const { username } = apiClient.getAuthenticationState().authentication;

    return (
      <div className="container-fluid py-5 justify-content-center align-items-start text-center">
        <div className="row">
          <div className="col">
            <p className="my-0 py-5 text-muted">
              <FormattedMessage
                id="profile.error.message.text"
                defaultMessage="An unexpected error occurred. Please click the button below to return to your profile and try again."
                description="error message when an unexpected error occurs"
              />
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <Link to={`/u/${username}`}>
              <Button
                buttonType="primary"
                label={
                  <FormattedMessage
                    id="profile.error.button.text"
                    defaultMessage="Return to Your Profile"
                    description="text for button that navigates back to your profile page after an error has occured"
                  />
                }
              />
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
