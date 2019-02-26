import React from 'react';
import PropTypes from 'prop-types';
import { UncontrolledAlert } from 'reactstrap';

function AgeMessage({ accountURL }) {
  return (
    <UncontrolledAlert color="info">
      <h6>Your profile cannot be shared.</h6>
      <p>
        To share your profile with other edX learners,
        you must confirm that you are over the age of 13.
      </p>
      <a href={accountURL}>Set your date of birth</a>
    </UncontrolledAlert>
  );
}

AgeMessage.propTypes = {
  accountURL: PropTypes.string.isRequired,
};

export default AgeMessage;
