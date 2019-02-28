import React from 'react';
import PropTypes from 'prop-types';
import { Input, Button, Label, Row, Col } from 'reactstrap';
import { injectIntl, intlShape } from 'react-intl';

import messages from './FormControls.messages';

import AsyncActionButton from './AsyncActionButton';

function FormControls({
  formId, cancelHandler, changeHandler, visibility, saveState, intl,
}) {
  const visibilityId = `${formId}-visibility`;
  return (
    <Row className="align-items-center flex-wrap-1 pt-3">
      <Col xs="auto" className="d-flex mb-3">
        <Label className="flex-shrink-0 d-inline-block mb-0 mr-2" size="sm" for={visibilityId}>
          {intl.formatMessage(messages['profile.formcontrols.who.can.see'])}
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
              {intl.formatMessage(messages['profile.formcontrols.who.just.me'])}
            </option>
            <option key="all_users" value="all_users">
              {intl.formatMessage(messages['profile.formcontrols.who.everyone'])}
            </option>
          </Input>
        </span>
      </Col>
      <Col xs="auto" className="flex-grow-1 d-flex justify-content-end mb-3">
        <Button color="link" onClick={cancelHandler}>
          {intl.formatMessage(messages['profile.formcontrols.button.cancel'])}
        </Button>
        <AsyncActionButton
          type="submit"
          variant={saveState}
          labels={{
            default: intl.formatMessage(messages['profile.formcontrols.button.save']),
            pending: intl.formatMessage(messages['profile.formcontrols.button.saving']),
            complete: intl.formatMessage(messages['profile.formcontrols.button.saved']),
            error: intl.formatMessage(messages['profile.formcontrols.button.save.failed']),
          }}
        />
      </Col>
    </Row>
  );
}

export default injectIntl(FormControls);

FormControls.propTypes = {
  formId: PropTypes.string.isRequired,
  saveState: PropTypes.oneOf([null, 'pending', 'complete', 'error']),
  visibility: PropTypes.oneOf(['private', 'all_users']),
  cancelHandler: PropTypes.func.isRequired,
  changeHandler: PropTypes.func.isRequired,

  // i18n
  intl: intlShape.isRequired,
};

FormControls.defaultProps = {
  visibility: 'private',
  saveState: null,
};
