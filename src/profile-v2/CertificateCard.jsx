import React from 'react';
import PropTypes from 'prop-types';
import { FormattedDate, FormattedMessage, useIntl } from '@edx/frontend-platform/i18n';
import { breakpoints, Hyperlink, useWindowSize } from '@openedx/paragon';
import get from 'lodash.get';

import classNames from 'classnames';
import professionalCertificateSVG from './assets/professional-certificate.svg';
import verifiedCertificateSVG from './assets/verified-certificate.svg';
import messages from './Certificates.messages';

const CertificateCard = ({
  certificateType,
  courseDisplayName,
  courseOrganization,
  modifiedDate,
  downloadUrl,
  courseId,
  uuid,
}) => {
  const intl = useIntl();

  const certificateIllustration = {
    professional: professionalCertificateSVG,
    'no-id-professional': professionalCertificateSVG,
    verified: verifiedCertificateSVG,
    honor: null,
    audit: null,
  }[certificateType] || null;

  const isMobileView = useWindowSize().width <= breakpoints.small.minWidth;

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
        <div className={classNames(
          'd-flex flex-column position-relative p-0',
          { 'max-width-19rem': isMobileView },
          { 'width-19625rem': !isMobileView },
        )}
        >
          <div className="w-100 color-black">
            <p className={classNames([
              'mb-0 font-weight-normal',
              isMobileView ? 'x-small' : 'small',
            ])}
            >
              {intl.formatMessage(get(
                messages,
                `profile.certificates.types.${certificateType}`,
                messages['profile.certificates.types.unknown'],
              ))}
            </p>
            <p className={classNames([
              'm-0 color-black',
              isMobileView ? 'h5' : 'h4',
            ])}
            >
              {courseDisplayName}
            </p>
            <p className={classNames([
              'mb-0',
              isMobileView ? 'x-small' : 'small',
            ])}
            >
              <FormattedMessage
                id="profile.certificate.organization.label"
                defaultMessage="From"
              />
            </p>
            <h5 className="mb-0 color-black">{courseOrganization}</h5>
            <p className={classNames([
              'mb-0',
              isMobileView ? 'x-small' : 'small',
            ])}
            >
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
              className={classNames(
                'btn btn-primary btn-rounded font-weight-normal px-4 py-0625rem',
                { 'btn-sm': isMobileView },
              )}
            >
              {intl.formatMessage(messages['profile.certificates.view.certificate'])}
            </Hyperlink>
          </div>
          <p
            className={classNames([
              'mb-0 pt-3',
              isMobileView ? 'x-small' : 'small',
            ])}
          >
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
};

CertificateCard.propTypes = {
  certificateType: PropTypes.string,
  courseDisplayName:
  PropTypes.string,
  courseOrganization: PropTypes.string,
  modifiedDate: PropTypes.string,
  downloadUrl: PropTypes.string,
  courseId: PropTypes.string.isRequired,
  uuid: PropTypes.string,
};

CertificateCard.defaultProps = {
  certificateType: 'unknown',
  courseDisplayName: '',
  courseOrganization: '',
  modifiedDate: '',
  downloadUrl: '',
  uuid: '',
};

export default CertificateCard;
