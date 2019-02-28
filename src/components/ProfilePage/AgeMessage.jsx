import React from 'react';
import { UncontrolledAlert } from 'reactstrap';
import { FormattedMessage } from 'react-intl';

import { configuration } from '../../config/environment';

const { ACCOUNT_SETTINGS_URL } = configuration;

function AgeMessage() {
  return (
    <UncontrolledAlert color="info">
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
      <a href={ACCOUNT_SETTINGS_URL}>
        <FormattedMessage
          id="profile.age.set.date"
          defaultMessage="Set your date of birth"
          description="label on a link to set birthday"
        />
      </a>
    </UncontrolledAlert>
  );
}

export default AgeMessage;
