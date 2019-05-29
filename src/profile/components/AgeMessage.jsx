import React from 'react';
import PropTypes from 'prop-types';
import { StatusAlert } from '@edx/paragon';
import { FormattedMessage } from '@edx/frontend-i18n';

function AgeMessage({ accountSettingsUrl }) {
  return (
    <StatusAlert
      alertType="info"
      dialog={
        <React.Fragment>
          <FormattedMessage
            id="profile.age.headline"
            defaultMessage="Your profile cannot be shared."
            description="error message"
            tagName="h6"
          />
          <FormattedMessage
            id="profile.age.details"
            defaultMessage="To share your profile with other edX learners, you must confirm that you are over the age of 13."
            description="error message"
            tagName="p"
          />
          <a href={accountSettingsUrl}>
            <FormattedMessage
              id="profile.age.set.date"
              defaultMessage="Set your date of birth"
              description="label on a link to set birthday"
            />
          </a>
        </React.Fragment>
      }
      dismissible={false}
      open
    />
  );
}

AgeMessage.propTypes = {
  accountSettingsUrl: PropTypes.string.isRequired,
};

export default AgeMessage;
