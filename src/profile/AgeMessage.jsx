import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from '@openedx/paragon';
import { FormattedMessage } from '@edx/frontend-platform/i18n';
import { getConfig } from '@edx/frontend-platform';

const AgeMessage = ({ accountSettingsUrl }) => (
  <Alert
    variant="info"
    dismissible={false}
    show
  >
    <Alert.Heading id="profile.age.headline">
      <FormattedMessage
        id="profile.age.cannotShare"
        defaultMessage="Your profile cannot be shared."
        description="Error message indicating that the user's profile cannot be shared"
      />
    </Alert.Heading>
    <FormattedMessage
      id="profile.age.details"
      defaultMessage="To share your profile with other {siteName} learners, you must confirm that you are over the age of 13."
      description="Error message"
      tagName="p"
      values={{
        siteName: getConfig().SITE_NAME,
      }}
    />
    <Alert.Link href={accountSettingsUrl}>
      <FormattedMessage
        id="profile.age.set.date"
        defaultMessage="Set your date of birth"
        description="Label on a link to set birthday"
      />
    </Alert.Link>
  </Alert>
);

AgeMessage.propTypes = {
  accountSettingsUrl: PropTypes.string.isRequired,
};

export default AgeMessage;
