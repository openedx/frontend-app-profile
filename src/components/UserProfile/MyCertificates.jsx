import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { Row, Col, Card, CardBody, CardTitle, CardText, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

import EditControls from './elements/EditControls';
import EditableItemHeader from './elements/EditableItemHeader';
import SwitchContent from './elements/SwitchContent';

function MyCertificates({
  certificates,
  visibility,
  editMode,
  onEdit,
  onSave,
  onCancel,
  onVisibilityChange,
  saveState,
  intl,
}) {
  const renderCertificates = () => {
    if (!certificates) return null;

    return (
      <Row>
        {certificates.map(({
          type: { key, name }, // eslint-disable-line no-unused-vars
          title,
          organization,
          downloadUrl,
        }) => (
          <Col key={downloadUrl} sm={6}>
            <Card className="mb-4 certificate">
              <CardBody>
                <CardTitle>
                  <p className="small mb-0">{name}</p>
                  <h4 className="certificate-title">{title}</h4>
                </CardTitle>
                <CardText>
                  <p className="small mb-0">From</p>
                  <h6 className="mb-4">{organization}</h6>
                  <div>
                    <Button
                      outline
                      color="primary"
                      href={downloadUrl}
                      target="blank"
                    >
                      <FontAwesomeIcon className="ml-n1 mr-2" icon={faDownload} />
                      Download
                    </Button>
                  </div>
                </CardText>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    );
  };

  return (
    <SwitchContent
      className="mb-4"
      expression={editMode}
      cases={{
        editing: (
          <React.Fragment>
            <EditableItemHeader content="My Certificates" />
            {renderCertificates()}
            <EditControls
              onCancel={() => onCancel('certificates')}
              onSave={() => onSave('certificates')}
              saveState={saveState}
              visibility={visibility}
              onVisibilityChange={e => onVisibilityChange('certificates', e.target.value)}
            />
          </React.Fragment>
        ),
        editable: (
          <React.Fragment>
            <EditableItemHeader
              content="My Certificates"
              showEditButton
              onClickEdit={() => onEdit('certificates')}
              showVisibility={Boolean(certificates)}
              visibility={visibility}
            />
            {renderCertificates()}
          </React.Fragment>
        ),
        empty: (
          <div>
            {intl.formatMessage({
              id: 'profile.no.certificates',
              defaultMessage: 'You don\'t have any certificates yet.',
              description: 'displays when user has no course completion certificates',
            })}_
          </div>
        ),
        static: (
          <React.Fragment>
            <EditableItemHeader content="My Certificates" />
            {renderCertificates()}
          </React.Fragment>
        ),
      }}
    />
  );
}


MyCertificates.propTypes = {
  editMode: PropTypes.string,
  intl: intlShape.isRequired,
  onEdit: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onVisibilityChange: PropTypes.func.isRequired,
  saveState: PropTypes.string,
  certificates: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
  })),
  visibility: PropTypes.oneOf(['private', 'all_users']),
};

MyCertificates.defaultProps = {
  editMode: 'static',
  saveState: null,
  certificates: null,
  visibility: 'private',
};


export default injectIntl(MyCertificates);
