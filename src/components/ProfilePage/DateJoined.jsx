import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedDate } from 'react-intl';

function DateJoined({ date }) {
  if (date == null) return null;

  return (
    <FormattedMessage
      id="profile.datejoined.member.since"
      defaultMessage="Member since {year}"
      description="A label for how long the user has been a member"
      values={{
        year: <FormattedDate value={new Date(date)} year="numeric" />,
      }}
      tagName="p"
      className="mb-0"
    />
  );
}

DateJoined.propTypes = {
  date: PropTypes.string,
};
DateJoined.defaultProps = {
  date: null,
};

export default DateJoined;
