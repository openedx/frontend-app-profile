import React from 'react';
import { FormattedMessage } from '@edx/frontend-platform/i18n';
import { VisibilityOff } from '@openedx/paragon/icons';
import { Icon } from '@openedx/paragon';
import { getConfig } from '@edx/frontend-platform';

const UsernameDescription = () => (
  <p className="text-gray-800 font-weight-normal m-0">
    <FormattedMessage
      id="profile.username.description"
      defaultMessage="Your learner records information is only visible to you. Only your username is visible to others on {siteName}."
      description="A description of the username field"
      values={{
        siteName: getConfig().SITE_NAME,
      }}
    />
  </p>
);

export default UsernameDescription;
