import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedDate } from '@edx/frontend-platform/i18n';

const DateJoined = ({ date }) => {
  if (date == null) {
    return null;
  }

  return (
    <p className="mb-0">
      <FormattedMessage
        id="profile.datejoined.member.since"
        defaultMessage="Member since {year}"
        description="A label for how long the user has been a member"
        values={{
          year: <FormattedDate value={new Date(date)} year="numeric" />,
        }}
      />
    </p>
  );
};

DateJoined.propTypes = {
  date: PropTypes.string,
};
DateJoined.defaultProps = {
  date: null,
};

export default DateJoined;
