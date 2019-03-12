import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import { Row, Col, Card, CardBody, CardTitle, Button, Form } from 'reactstrap';
import { connect } from 'react-redux';

import messages from './Certificates.messages';

// Components
import FormControls from './elements/FormControls';
import EditableItemHeader from './elements/EditableItemHeader';
import SwitchContent from './elements/SwitchContent';

// Assets
import microMastersSVG from '../../../assets/micro-masters.svg';
import professionalCertificateSVG from '../../../assets/professional-certificate.svg';
import verifiedCertificateSVG from '../../../assets/verified-certificate.svg';

// Selectors
import { certificatesSelector } from '../../selectors/ProfilePageSelector';

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
    certificateType, courseDisplayName, courseOrganization, downloadUrl,
  }) {
    const { intl } = this.props;
    const certificateIllustration = ((type) => {
      switch (type) {
        case 'Professional Certificate':
          return professionalCertificateSVG;
        case 'MicroMasters Certificate':
          return microMastersSVG;
        case 'Verified Certificate':
        default:
          return verifiedCertificateSVG;
      }
    })(certificateType);

    return (
      <Col key={downloadUrl} sm={6}>
        <Card className="mb-4 certificate">
          <div
            className="certificate-type-illustration"
            style={{ backgroundImage: `url(${certificateIllustration})` }}
          />
          <CardBody>
            <CardTitle>
              <p className="small mb-0">{certificateType}</p>
              <h4 className="certificate-title">{courseDisplayName}</h4>
            </CardTitle>
            <p className="small mb-0">
              <FormattedMessage
                id="profile.certificate.organization.label"
                defaultMessage="From"
              />
            </p>
            <p className="h6 mb-4">{courseOrganization}</p>
            <div>
              <Button outline color="primary" href={downloadUrl} target="blank">
                {intl.formatMessage(messages['profile.certificates.view.certificate'])}
              </Button>
            </div>
          </CardBody>
        </Card>
      </Col>
    );
  }

  renderCertificates() {
    if (this.props.certificates === null || this.props.certificates.length === 0) {
      return (<FormattedMessage
        id="profile.no.certificates"
        defaultMessage="You don't have any certificates yet."
        description="displays when user has no course completion certificates"
      />);
    }

    return (
      <Row>{this.props.certificates.map(certificate => this.renderCertificate(certificate))}</Row>
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
              <Form onSubmit={this.handleSubmit}>
                <EditableItemHeader
                  headingId="course-certificates-label"
                  content={intl.formatMessage(messages['profile.certificates.my.certificates'])}
                />
                {this.renderCertificates()}
                <FormControls
                  visibilityId="visibilityCourseCertificates"
                  saveState={saveState}
                  visibility={visibilityCourseCertificates}
                  cancelHandler={this.handleClose}
                  changeHandler={this.handleChange}
                />
              </Form>
            </div>
          ),
          editable: (
            <React.Fragment>
              <EditableItemHeader
                content={intl.formatMessage(messages['profile.certificates.my.certificates'])}
                showEditButton
                onClickEdit={this.handleOpen}
                showVisibility={visibilityCourseCertificates !== null}
                visibility={visibilityCourseCertificates}
              />
              {this.renderCertificates()}
            </React.Fragment>
          ),
          empty: (
            <React.Fragment>
              <EditableItemHeader
                content={intl.formatMessage(messages['profile.certificates.my.certificates'])}
                showEditButton
                onClickEdit={this.handleOpen}
                showVisibility={visibilityCourseCertificates !== null}
                visibility={visibilityCourseCertificates}
              />
              {this.renderCertificates()}
            </React.Fragment>
          ),
          static: (
            <React.Fragment>
              <EditableItemHeader content={intl.formatMessage(messages['profile.certificates.my.certificates'])} />
              {this.renderCertificates()}
            </React.Fragment>
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
