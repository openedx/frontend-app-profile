import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Button,
  Form,
  Input,
  Label,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

import AsyncActionButton from './elements/AsyncActionButton';
import EditableItemHeader from './elements/EditableItemHeader';
import SwitchContent from './elements/SwitchContent';

function MyCertificates({
  certificates,
  visibility,
  editMode,
  onEdit,
  onSubmit,
  onCancel,
  onChange,
  saveState,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit('certificates');
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ name, value });
  };
  const handleClickCancel = () => {
    onCancel('certificates');
  };

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
          <Form onSubmit={handleSubmit} onChange={handleChange}>
            <EditableItemHeader content="My Certificates" />
            {renderCertificates()}
            <Label for="visibility.certificates">Who can see this:</Label>
            <Input type="select" name="visibility.certificates" defaultValue={visibility}>
              <option value="private">Just me</option>
              <option value="all_users">Everyone on edX</option>
            </Input>
            <Button color="link" onClick={handleClickCancel}>Cancel</Button>
            <AsyncActionButton
              type="submit"
              variant={saveState}
              labels={{
                default: 'Save',
                pending: 'Saving',
                complete: 'Saved',
                error: 'Save Failed',
              }}
            />
          </Form>
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
            <FormattedMessage
              id="profile.no.certificates"
              defaultMessage="You don't have any certificates yet."
              description="displays when user has no course completion certificates"
            />
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
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
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


export default MyCertificates;
