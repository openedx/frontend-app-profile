import React from 'react';
import PropTypes from 'prop-types';

function DateJoined({ date }) {
  if (date == null) return null;

  // Not a proper way to do it, but probably cheaper than creating a Date.
  const year = date.substring(0, 4);

  return (
    <p className="mb-0">Member since {year}</p>
  );
}

DateJoined.propTypes = {
  date: PropTypes.string,
};
DateJoined.defaultProps = {
  date: null,
};

export default DateJoined;
