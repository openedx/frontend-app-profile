import React from 'react';
import PropTypes from 'prop-types';
import { Button, StatefulButton } from '@edx/paragon';
import { injectIntl, intlShape } from 'react-intl';

import messages from './FormControls.messages';

import { VisibilitySelect } from './Visibility';

function FormControls({
  cancelHandler, changeHandler, visibility, visibilityId, saveState, intl,
}) {
  // Eliminate error/failed state for save button
  const buttonState = saveState === 'error' ? null : saveState;

  return (
    <div className="d-flex flex-row-reverse flex-wrap justify-content-end align-items-center">
      <div className="form-group">
        <label className="col-form-label" htmlFor={visibilityId}>
          {intl.formatMessage(messages['profile.formcontrols.who.can.see'])}
        </label>
        <VisibilitySelect
          id={visibilityId}
          className="w-auto"
          type="select"
          name={visibilityId}
          value={visibility}
          onChange={changeHandler}
        />
      </div>
      <div className="form-group flex-shrink-0 mr-auto">
        <StatefulButton
          type="submit"
          className="btn-primary"
          state={buttonState}
          labels={{
            default: intl.formatMessage(messages['profile.formcontrols.button.save']),
            pending: intl.formatMessage(messages['profile.formcontrols.button.saving']),
            complete: intl.formatMessage(messages['profile.formcontrols.button.saved']),
          }}
        />
        <Button className="btn-link" onClick={cancelHandler}>
          {intl.formatMessage(messages['profile.formcontrols.button.cancel'])}
        </Button>
      </div>
    </div>
  );
}

export default injectIntl(FormControls);

FormControls.propTypes = {
  saveState: PropTypes.oneOf([null, 'pending', 'complete', 'error']),
  visibility: PropTypes.oneOf(['private', 'all_users']),
  visibilityId: PropTypes.string.isRequired,
  cancelHandler: PropTypes.func.isRequired,
  changeHandler: PropTypes.func.isRequired,

  // i18n
  intl: intlShape.isRequired,
};

FormControls.defaultProps = {
  visibility: 'private',
  saveState: null,
};
