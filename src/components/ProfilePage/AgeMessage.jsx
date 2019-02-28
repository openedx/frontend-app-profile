import React from 'react';
import PropTypes from 'prop-types';
import { UncontrolledAlert } from 'reactstrap';
import { FormattedMessage } from 'react-intl';

function AgeMessage({ accountURL }) {
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
      <a href={accountURL}>
        <FormattedMessage
          id="profile.age.set.date"
          defaultMessage="Set your date of birth"
          description="label on a link to set birthday"
        />
      </a>
    </UncontrolledAlert>
  );
}

AgeMessage.propTypes = {
  accountURL: PropTypes.string.isRequired,
};

export default AgeMessage;
