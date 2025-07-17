import React from 'react';
import PropTypes from 'prop-types';
import { Button, StatefulButton } from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';

import messages from './FormControls.messages';

import { VisibilitySelect } from './Visibility';
import { useIsVisibilityEnabled } from '../../data/hooks';

const FormControls = ({
  cancelHandler,
  changeHandler,
  visibility,
  visibilityId,
  saveState,
}) => {
  const intl = useIntl();
  const buttonState = saveState === 'error' ? null : saveState;
  const isVisibilityEnabled = useIsVisibilityEnabled();

  return (
    <div className="d-flex flex-row-reverse flex-wrap justify-content-end align-items-center">
      {isVisibilityEnabled && (
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
      )}
      <div className="row form-group flex-shrink-0 flex-grow-1 m-0 p-0">
        <div className="pr-2 pl-0 m-0">
          <Button variant="outline-primary" onClick={cancelHandler}>
            {intl.formatMessage(messages['profile.formcontrols.button.cancel'])}
          </Button>
        </div>
        <div className="p-0 m-0">
          <StatefulButton
            type="submit"
            state={buttonState}
            labels={{
              default: intl.formatMessage(
                messages['profile.formcontrols.button.save']
              ),
              pending: intl.formatMessage(
                messages['profile.formcontrols.button.saving']
              ),
              complete: intl.formatMessage(
                messages['profile.formcontrols.button.saved']
              ),
            }}
            onClick={(e) => {
              if (buttonState === 'pending') {
                e.preventDefault();
              }
            }}
            disabledStates={[]}
          />
        </div>
      </div>
    </div>
  );
};

export default FormControls;

FormControls.propTypes = {
  saveState: PropTypes.oneOf([null, 'pending', 'complete', 'error']),
  visibility: PropTypes.oneOf(['private', 'all_users']),
  visibilityId: PropTypes.string.isRequired,
  cancelHandler: PropTypes.func.isRequired,
  changeHandler: PropTypes.func.isRequired,
};

FormControls.defaultProps = {
  visibility: 'private',
  saveState: null,
};
