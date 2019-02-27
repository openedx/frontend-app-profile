import React from 'react';
import PropTypes from 'prop-types';
import { Input, Button, Label, Row, Col } from 'reactstrap';
import AsyncActionButton from './AsyncActionButton';

function FormControls({
  formId, cancelHandler, changeHandler, visibility, saveState,
}) {
  const visibilityId = `${formId}-visibility`;
  return (
    <Row className="align-items-center flex-wrap-1 pt-3">
      <Col xs="auto" className="d-flex mb-3">
        <Label className="flex-shrink-0 d-inline-block mb-0 mr-2" size="sm" for={visibilityId}>
          Who can see this:
        </Label>
        <span>
          <Input
            id={visibilityId}
            className="d-inline-block"
            bsSize="sm"
            type="select"
            name="visibility"
            value={visibility}
            onChange={changeHandler}
          >
            <option key="private" value="private">
              Just me
            </option>
            <option key="all_users" value="all_users">
              Everyone on edX
            </option>
          </Input>
        </span>
      </Col>
      <Col xs="auto" className="flex-grow-1 d-flex justify-content-end mb-3">
        <Button color="link" onClick={cancelHandler}>
          Cancel
        </Button>
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
      </Col>
    </Row>
  );
}

export default FormControls;

FormControls.propTypes = {
  formId: PropTypes.string.isRequired,
  saveState: PropTypes.oneOf([null, 'pending', 'complete', 'error']),
  visibility: PropTypes.oneOf(['private', 'all_users']),
  cancelHandler: PropTypes.func.isRequired,
  changeHandler: PropTypes.func.isRequired,
};

FormControls.defaultProps = {
  visibility: 'private',
  saveState: null,
};
