import React from 'react';
import PropTypes from 'prop-types';

function DateJoined({ date }) {
  if (date == null) return null;

  const year = (new Date(date)).getFullYear();

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
