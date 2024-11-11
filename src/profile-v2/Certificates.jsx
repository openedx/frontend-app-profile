import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from '@edx/frontend-platform/i18n';
import { connect } from 'react-redux';
import { getConfig } from '@edx/frontend-platform';

import CertificateCard from './CertificateCard';
import { certificatesSelector } from './data/selectors';

const Certificates = ({ certificates }) => (
  <div>
    <div className="col justify-content-start align-items-start g-5rem p-0">
      <div className="col align-self-stretch height-2625rem justify-content-start align-items-start p-0">
        <h2 className="font-weight-bold text-primary-500 m-0">
          <FormattedMessage
            id="profile.your.certificates"
            defaultMessage="Your certificates"
            description="heading for the certificates section"
          />
        </h2>
      </div>
      <div className="col justify-content-start align-items-start pt-2 p-0">
        <p className="font-weight-normal text-gray-800 m-0 p-0">
          <FormattedMessage
            id="profile.certificates.description"
            defaultMessage="Your learner records information is only visible to you. Only your username is visible to others on {siteName}."
            description="description of the certificates section"
            values={{
              siteName: getConfig().SITE_NAME,
            }}
          />
        </p>
      </div>
    </div>
    {certificates && certificates.length > 0 ? (
      <div className="col">
        <div className="row align-items-center pt-5 g-3rem">
          {certificates.map(certificate => (
            <CertificateCard key={certificate.courseId} {...certificate} />
          ))}
        </div>
      </div>
    ) : (
      <div className="pt-5">
        <FormattedMessage
          id="profile.no.certificates"
          defaultMessage="You don't have any certificates yet."
          description="displays when user has no course completion certificates"
        />
      </div>
    )}
  </div>
);

Certificates.propTypes = {
  certificates: PropTypes.arrayOf(PropTypes.shape({
    certificateType: PropTypes.string,
    courseDisplayName: PropTypes.string,
    courseOrganization: PropTypes.string,
    modifiedDate: PropTypes.string,
    downloadUrl: PropTypes.string,
    courseId: PropTypes.string.isRequired,
    uuid: PropTypes.string,
  })),
};

Certificates.defaultProps = {
  certificates: [],
};

export default connect(
  certificatesSelector,
  {},
)(Certificates);
