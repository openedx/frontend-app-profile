import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from '@edx/frontend-platform/i18n';

const UserCertificateSummary = ({ count = 0 }) => {
  if (count !== 0) {
    return (
      <span className="small m-0 text-gray-800">
        <FormattedMessage
          id="profile.certificatecount"
          defaultMessage="{certificate_count} certifications"
          description="A label for many certificates a user has"
          values={{
            certificate_count: <span className="font-weight-bold">{count}</span>,
          }}
        />
      </span>
    );
  }
  return null;
};

UserCertificateSummary.propTypes = {
  count: PropTypes.number,
};

export default UserCertificateSummary;
