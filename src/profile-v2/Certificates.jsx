import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  FormattedDate, FormattedMessage, useIntl,
} from '@edx/frontend-platform/i18n';
import { Hyperlink } from '@openedx/paragon';
import { connect } from 'react-redux';
import get from 'lodash.get';

import { getConfig } from '@edx/frontend-platform';
import messages from './Certificates.messages';

// Assets
import professionalCertificateSVG from './assets/professional-certificate.svg';
import verifiedCertificateSVG from './assets/verified-certificate.svg';

// Selectors
import { certificatesSelector } from './data/selectors';

const Certificates = ({
  certificates,
}) => {
  const intl = useIntl();

  const renderCertificate = useCallback(({
    certificateType, courseDisplayName, courseOrganization, modifiedDate, downloadUrl, courseId, uuid,
  }) => {
    const certificateIllustration = (() => {
      switch (certificateType) {
        case 'professional':
        case 'no-id-professional':
          return professionalCertificateSVG;
        case 'verified':
          return verifiedCertificateSVG;
        case 'honor':
        case 'audit':
        default:
          return null;
      }
    })();

    return (
      <div
        key={`${modifiedDate}-${courseId}`}
        className="col-auto d-flex align-items-center p-0"
      >
        <div className="col certificate p-4 border-light-400 bg-light-200 w-100 h-100">
          <div
            className="certificate-type-illustration"
            style={{ backgroundImage: `url(${certificateIllustration})` }}
          />
          <div className="card-body d-flex flex-column p-0 width-19625rem">
            <div className="w-100 color-black">
              <p className="small mb-0 font-weight-normal">
                {intl.formatMessage(get(
                  messages,
                  `profile.certificates.types.${certificateType}`,
                  messages['profile.certificates.types.unknown'],
                ))}
              </p>
              <div className="h4 m-0 line-height-1575rem">{courseDisplayName}</div>
              <p className="small mb-0">
                <FormattedMessage
                  id="profile.certificate.organization.label"
                  defaultMessage="From"
                />
              </p>
              <p className="h5 mb-0">{courseOrganization}</p>
              <p className="small mb-0">
                <FormattedMessage
                  id="profile.certificate.completion.date.label"
                  defaultMessage="Completed on {date}"
                  values={{
                    date: <FormattedDate value={new Date(modifiedDate)} />,
                  }}
                />
              </p>
            </div>
            <div className="pt-3">
              <Hyperlink
                destination={downloadUrl}
                target="_blank"
                showLaunchIcon={false}
                className="btn btn-primary btn-rounded font-weight-normal px-4 py-0625rem"
              >
                {intl.formatMessage(messages['profile.certificates.view.certificate'])}
              </Hyperlink>
            </div>
            <p className="small mb-0 pt-3">
              <FormattedMessage
                id="profile.certificate.uuid"
                defaultMessage="Credential ID {certificate_uuid}"
                values={{
                  certificate_uuid: uuid,
                }}
              />
            </p>
          </div>
        </div>
      </div>
    );
  }, [intl]);

  // Memoizing the renderCertificates to avoid recalculations
  const renderCertificates = useMemo(() => {
    if (!certificates || certificates.length === 0) {
      return (
        <FormattedMessage
          id="profile.no.certificates"
          defaultMessage="You don't have any certificates yet."
          description="displays when user has no course completion certificates"
        />
      );
    }

    return (
      <div className="col">
        <div className="row align-items-center pt-5 g-3rem">
          {certificates.map(certificate => renderCertificate(certificate))}
        </div>
      </div>
    );
  }, [certificates, renderCertificate]);

  // Main Render
  return (
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
      {renderCertificates}
    </div>
  );
};

Certificates.propTypes = {

  // From Selector
  certificates: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
  })),
};

Certificates.defaultProps = {
  certificates: null,
};

export default connect(
  certificatesSelector,
  {},
)(Certificates);
