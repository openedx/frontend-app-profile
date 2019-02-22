import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation, useTranslation } from 'react-i18next';
import { Row, Col, Card, CardBody, CardTitle } from 'reactstrap';

import EditControls from './elements/EditControls';
import EditableItemHeader from './elements/EditableItemHeader';
import SwitchContent from './elements/SwitchContent';

function MyCertificates({
  certificates,
  editMode,
  onEdit,
  onSave,
  onCancel,
  onVisibilityChange,
  saveState,
}) {
  const { t } = useTranslation();

  const renderCertificates = () => {
    if (!certificates) return null;

    return (
      <Row>
        {certificates.map(({ title }) => (
          <Col key={title} sm={6}>
            <Card className="mb-4">
              <CardBody>
                <CardTitle>{title}</CardTitle>
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
              visibility="Everyone"
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
              visibility="Everyone"
            />
            {renderCertificates()}
          </React.Fragment>
        ),
        empty: (
          <div>
            {t('profile.certificates', { count: 12, replace: { name: 'Robert', count: 12 } })}
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
  onEdit: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onVisibilityChange: PropTypes.func.isRequired,
  saveState: PropTypes.string,
  certificates: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
  })),
};

MyCertificates.defaultProps = {
  editMode: 'static',
  saveState: null,
  certificates: null,
};


export default withTranslation()(MyCertificates);
