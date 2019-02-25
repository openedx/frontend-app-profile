import React from 'react';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash, faEye } from '@fortawesome/free-regular-svg-icons';

function Visibility({ to }) {
  const icon = to === 'private' ? faEyeSlash : faEye;
  const label = to === 'private' ? 'Just me' : 'Everyone on edX';

  return (
    <span className="ml-auto small text-muted">
      <FontAwesomeIcon icon={icon} /> {label}
    </span>
  );
}

export default Visibility;

Visibility.propTypes = {
  to: PropTypes.oneOf(['private', 'all_users']),
};

Visibility.defaultProps = {
  to: 'private',
};
