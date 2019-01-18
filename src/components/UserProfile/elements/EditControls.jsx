import React from 'react';
import PropTypes from 'prop-types';
import { Input, Button, Label, Row, Col } from 'reactstrap';
import AsyncActionButton from './AsyncActionButton';

function EditControls({
  onCancel,
  onSave,
  visibility,
  onVisibilityChange,
  saveState,
}) {
  return (
    <Row className="align-items-center flex-wrap-1 pt-3">
      <Col xs="auto" className="d-flex mb-3">
        <Label className="flex-shrink-0 d-inline-block mb-0 mr-2" size="sm" for="exampleSelect">Who can see this:</Label>
        <span>
          <Input
            className="d-inline-block"
            bsSize="sm"
            type="select"
            name="select"
            value={visibility}
            onChange={onVisibilityChange}
          >
            <option key="Just me" value="Just me">Just me</option>
            <option key="Everyone" value="Everyone">Everyone</option>
          </Input>
        </span>
      </Col>
      <Col xs="auto" className="flex-grow-1 d-flex justify-content-end mb-3">
        <Button color="link" onClick={onCancel}>Cancel</Button>
        <AsyncActionButton
          onClick={onSave}
          variant={saveState}
          labels={{
            default: 'Save',
            pending: 'Saving',
            complete: 'Saved',
            error: 'Save Failed',
          }}
        />
      </Col>
    </Row>
  );
}

export default EditControls;

EditControls.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  visibility: PropTypes.oneOf(['Everyone', 'Just me']),
  onVisibilityChange: PropTypes.func,
  saveState: PropTypes.oneOf([null, 'pending', 'complete', 'error']),
};

EditControls.defaultProps = {
  visibility: null,
  onVisibilityChange: null,
  saveState: null,
};
