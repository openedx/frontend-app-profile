import React from 'react';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash, faEye } from '@fortawesome/free-regular-svg-icons';

function Visibility({ to }) {
  const icon = to === 'Everyone' ? faEye : faEyeSlash;

  return (
    <span className="ml-auto small text-muted">
      <FontAwesomeIcon icon={icon} /> {to}
    </span>
  );
}

export default Visibility;

Visibility.propTypes = {
  to: PropTypes.oneOf(['Everyone', 'Just me']),
};

Visibility.defaultProps = {
  to: 'Everyone',
};
