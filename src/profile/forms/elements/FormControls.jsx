import React from 'react';
import PropTypes from 'prop-types';
import { Button, StatefulButton } from '@openedx/paragon';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import messages from './FormControls.messages';

import { VisibilitySelect } from './Visibility';

const FormControls = ({
  cancelHandler, changeHandler, visibility, visibilityId, saveState, intl,
}) => {
  // Eliminate error/failed state for save button
  const buttonState = saveState === 'error' ? null : saveState;

  return (
    <div className="d-flex flex-row-reverse flex-wrap justify-content-end align-items-center">
      <div className="form-group d-flex flex-wrap">
        <label className="col-form-label" htmlFor={visibilityId}>
          {intl.formatMessage(messages['profile.formcontrols.who.can.see'])}
        </label>
        <VisibilitySelect
          id={visibilityId}
          className="d-flex align-items-center"
          type="select"
          name={visibilityId}
          value={visibility}
          onChange={changeHandler}
        />
      </div>
      <div className="form-group flex-shrink-0 flex-grow-1">
        <StatefulButton
          type="submit"
          state={buttonState}
          labels={{
            default: intl.formatMessage(messages['profile.formcontrols.button.save']),
            pending: intl.formatMessage(messages['profile.formcontrols.button.saving']),
            complete: intl.formatMessage(messages['profile.formcontrols.button.saved']),
          }}
          onClick={(e) => {
            // Swallow clicks if the state is pending.
            // We do this instead of disabling the button to prevent
            // it from losing focus (disabled elements cannot have focus).
            // Disabling it would causes upstream issues in focus management.
            // Swallowing the onSubmit event on the form would be better, but
            // we would have to add that logic for every field given our
            // current structure of the application.
            if (buttonState === 'pending') {
              e.preventDefault();
            }
          }}
          disabledStates={[]}
        />
        <Button variant="link" onClick={cancelHandler}>
          {intl.formatMessage(messages['profile.formcontrols.button.cancel'])}
        </Button>
      </div>
    </div>
  );
};

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
