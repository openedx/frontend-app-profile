import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedDate } from '@edx/frontend-platform/i18n';

const DateJoined = ({ date }) => {
  if (date == null) {
    return null;
  }

  return (
    <span className="small mb-0 text-gray-800">
      <FormattedMessage
        id="profile.datejoined.member.since"
        defaultMessage="Member since {year}"
        description="A label for how long the user has been a member"
        values={{
          year: <span className="font-weight-bold"> <FormattedDate value={new Date(date)} year="numeric" /> </span>,
        }}
      />
    </span>
  );
};

DateJoined.propTypes = {
  date: PropTypes.string,
};
DateJoined.defaultProps = {
  date: null,
};

export default DateJoined;
