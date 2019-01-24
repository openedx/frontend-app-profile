import React from 'react';
import PropTypes from 'prop-types';
import { Input, Button, Label, Row, Col } from 'reactstrap';
import AsyncActionButton from './AsyncActionButton';

function EditControls({ onCancel, onSave }) {
  return (
    <Row className="align-items-center">
      <Col className="mt-3 mb-3 d-flex">
        <Label className="d-inline-block mb-0 mr-2" size="sm" for="exampleSelect">Who can see this:</Label>
        <Input className="d-inline-block w-auto" bsSize="sm" type="select" name="select" id="exampleSelect">
          <option>Just me</option>
          <option>Everyone</option>
        </Input>
      </Col>
      <Col className="col-auto mt-3 mb-3">
        <Button color="link" onClick={onCancel}>Cancel</Button>
        <AsyncActionButton
          onClick={onSave}
          variant="default"
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
};
