import React from 'react';
import { FormattedMessage } from '@edx/frontend-platform/i18n';
import { getConfig } from '@edx/frontend-platform';
import classNames from 'classnames';
import { breakpoints, useWindowSize } from '@openedx/paragon';

const UsernameDescription = () => {
  const isMobileView = useWindowSize().width <= breakpoints.small.minWidth;
  return (
    <p className={classNames([
      'text-gray-800 font-weight-normal m-0',
      isMobileView ? 'h5' : 'p',
    ])}
    >
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
};

export default UsernameDescription;
