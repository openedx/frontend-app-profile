import React from 'react';
import { FormattedMessage } from '@edx/frontend-platform/i18n';
import { VisibilityOff } from '@edx/paragon/icons';
import { Icon } from '@edx/paragon';

function UsernameDescription() {
  return (
    <div className="d-flex align-items-center mt-3 mb-2rem">
      <Icon src={VisibilityOff} className="icon-visibility-off" />
      <div className="username-description">
        <FormattedMessage
          id="profile.username.description"
          defaultMessage="Your profile information is only visible to you. Only your username is visible to others on edX."
          description="A description of the username field"
        />
      </div>
    </div>
  );
}

export default UsernameDescription;
