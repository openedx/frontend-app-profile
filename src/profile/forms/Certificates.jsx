import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedDate, FormattedMessage, injectIntl, intlShape,
} from '@edx/frontend-platform/i18n';
import { Hyperlink } from '@openedx/paragon';
import { connect } from 'react-redux';
import get from 'lodash.get';

import messages from './Certificates.messages';

// Components
import FormControls from './elements/FormControls';
import EditableItemHeader from './elements/EditableItemHeader';
import SwitchContent from './elements/SwitchContent';

// Assets
import professionalCertificateSVG from '../assets/professional-certificate.svg';
import verifiedCertificateSVG from '../assets/verified-certificate.svg';

// Selectors
import { certificatesSelector } from '../data/selectors';

class Certificates extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.props.changeHandler(name, value);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.submitHandler(this.props.formId);
  }

  handleClose() {
    this.props.closeHandler(this.props.formId);
  }

  handleOpen() {
    this.props.openHandler(this.props.formId);
  }

  renderCertificate({
    certificateType, courseDisplayName, courseOrganization, modifiedDate, downloadUrl, courseId,
  }) {
    const { intl } = this.props;
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
      <div key={`${modifiedDate}-${courseId}`} className="col-12 col-sm-6 d-flex align-items-stretch">
        <div className="card mb-4 certificate flex-grow-1">
          <div
            className="certificate-type-illustration"
            style={{ backgroundImage: `url(${certificateIllustration})` }}
          />
          <div className="card-body d-flex flex-column">
            <div className="card-title">
              <p className="small mb-0">
                {intl.formatMessage(get(
                  messages,
                  `profile.certificates.types.${certificateType}`,
                  messages['profile.certificates.types.unknown'],
                ))}
              </p>
              <h4 className="certificate-title">{courseDisplayName}</h4>
            </div>
            <p className="small mb-0">
              <FormattedMessage
                id="profile.certificate.organization.label"
                defaultMessage="From"
              />
            </p>
            <p className="h6 mb-4">{courseOrganization}</p>
            <div className="flex-grow-1" />
            <p className="small mb-2">
              <FormattedMessage
                id="profile.certificate.completion.date.label"
                defaultMessage="Completed on {date}"
                values={{
                  date: <FormattedDate value={new Date(modifiedDate)} />,
                }}
              />
            </p>
            <div>
              <Hyperlink destination={downloadUrl} className="btn btn-outline-primary" target="_blank">
                {intl.formatMessage(messages['profile.certificates.view.certificate'])}
              </Hyperlink>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderCertificates() {
    if (this.props.certificates === null || this.props.certificates.length === 0) {
      return (
        <FormattedMessage
          id="profile.no.certificates"
          defaultMessage="You don't have any certificates yet."
          description="displays when user has no course completion certificates"
        />
      );
    }

    return (
      <div className="row align-items-stretch">{this.props.certificates.map(certificate => this.renderCertificate(certificate))}</div>
    );
  }

  render() {
    const {
      visibilityCourseCertificates, editMode, saveState, intl,
    } = this.props;

    return (
      <SwitchContent
        className="mb-4"
        expression={editMode}
        cases={{
          editing: (
            <div role="dialog" aria-labelledby="course-certificates-label">
              <form onSubmit={this.handleSubmit}>
                <EditableItemHeader
                  headingId="course-certificates-label"
                  content={intl.formatMessage(messages['profile.certificates.my.certificates'])}
                />
                <FormControls
                  visibilityId="visibilityCourseCertificates"
                  saveState={saveState}
                  visibility={visibilityCourseCertificates}
                  cancelHandler={this.handleClose}
                  changeHandler={this.handleChange}
                />
                {this.renderCertificates()}
              </form>
            </div>
          ),
          editable: (
            <>
              <EditableItemHeader
                content={intl.formatMessage(messages['profile.certificates.my.certificates'])}
                showEditButton
                onClickEdit={this.handleOpen}
                showVisibility={visibilityCourseCertificates !== null}
                visibility={visibilityCourseCertificates}
              />
              {this.renderCertificates()}
            </>
          ),
          empty: (
            <>
              <EditableItemHeader
                content={intl.formatMessage(messages['profile.certificates.my.certificates'])}
                showEditButton
                onClickEdit={this.handleOpen}
                showVisibility={visibilityCourseCertificates !== null}
                visibility={visibilityCourseCertificates}
              />
              {this.renderCertificates()}
            </>
          ),
          static: (
            <>
              <EditableItemHeader content={intl.formatMessage(messages['profile.certificates.my.certificates'])} />
              {this.renderCertificates()}
            </>
          ),
        }}
      />
    );
  }
}

Certificates.propTypes = {
  // It'd be nice to just set this as a defaultProps...
  // except the class that comes out on the other side of react-redux's
  // connect() method won't have it anymore. Static properties won't survive
  // through the higher order function.
  formId: PropTypes.string.isRequired,

  // From Selector
  certificates: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
  })),
  visibilityCourseCertificates: PropTypes.oneOf(['private', 'all_users']),
  editMode: PropTypes.oneOf(['editing', 'editable', 'empty', 'static']),
  saveState: PropTypes.string,

  // Actions
  changeHandler: PropTypes.func.isRequired,
  submitHandler: PropTypes.func.isRequired,
  closeHandler: PropTypes.func.isRequired,
  openHandler: PropTypes.func.isRequired,

  // i18n
  intl: intlShape.isRequired,
};

Certificates.defaultProps = {
  editMode: 'static',
  saveState: null,
  visibilityCourseCertificates: 'private',
  certificates: null,
};

export default connect(
  certificatesSelector,
  {},
)(injectIntl(Certificates));
