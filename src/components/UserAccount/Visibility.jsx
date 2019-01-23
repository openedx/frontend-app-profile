import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@edx/paragon';


function Visibility({ to }) {
  return (
    <span className="ml-auto small text-muted"><Icon className="fa fa-eye-slash" /> {to}</span>
  );
}

export default Visibility;


Visibility.propTypes = {
  to: PropTypes.oneOf(['Everyone', 'Just me']),
};

Visibility.defaultProps = {
  to: 'Everyone',
};
