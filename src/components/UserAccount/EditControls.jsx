import React from 'react';
import PropTypes from 'prop-types';
import { Input, Button, Label, Row, Col } from 'reactstrap';
import AsyncActionButton from './AsyncActionButton';

function EditControls({
  onCancel,
  onSave,
  visibility,
  onVisibilityChange,
}) {
  return (
    <Row className="align-items-center">
      <Col className="mt-3 mb-3 d-flex">
        <Label className="d-inline-block mb-0 mr-2" size="sm" for="exampleSelect">Who can see this:</Label>
        <Input
          className="d-inline-block
          w-auto"
          bsSize="sm"
          type="select"
          name="select"
          value={visibility}
          onChange={onVisibilityChange}
        >
          <option key="Just me" value="Just me">Just me</option>
          <option key="Everyone" value="Everyone">Everyone</option>
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
  visibility: PropTypes.oneOf(['Everyone', 'Just me']),
  onVisibilityChange: PropTypes.func,
};

EditControls.defaultProps = {
  visibility: null,
  onVisibilityChange: null,
};
