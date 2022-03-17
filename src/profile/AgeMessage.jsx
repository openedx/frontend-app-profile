import React from 'react';
import PropTypes from 'prop-types';
import { StatusAlert } from '@edx/paragon';
import { FormattedMessage } from '@edx/frontend-platform/i18n';

function AgeMessage({ accountSettingsUrl }) {
  return (
    <StatusAlert
      alertType="info"
      dialog={(
        <>
          <FormattedMessage
            id="profile.age.headline"
            defaultMessage="Your profile cannot be shared."
            description="error message"
            tagName="h6"
          />
          <FormattedMessage
            id="profile.age.details"
            defaultMessage="To share your profile with other edX learners, you must confirm that you are over the age of 13."
            description="Error message"
            tagName="p"
          />
          <a href={accountSettingsUrl}>
            <FormattedMessage
              id="profile.age.set.date"
              defaultMessage="Set your date of birth"
              description="Label on a link to set birthday"
            />
          </a>
        </>
      )}
      dismissible={false}
      open
    />
  );
}

AgeMessage.propTypes = {
  accountSettingsUrl: PropTypes.string.isRequired,
};

export default AgeMessage;
