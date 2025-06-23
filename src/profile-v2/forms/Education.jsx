import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, useIntl } from '@edx/frontend-platform/i18n';
import get from 'lodash.get';
import { Form } from '@openedx/paragon';

import messages from './Education.messages';

import FormControls from './elements/FormControls';
import EditableItemHeader from './elements/EditableItemHeader';
import EmptyContent from './elements/EmptyContent';
import SwitchContent from './elements/SwitchContent';

import { EDUCATION_LEVELS } from '../data/constants';

import { editableFormSelector } from '../data/selectors';
import {
  useCloseOpenHandler,
  useHandleChange,
  useHandleSubmit,
  useIsVisibilityEnabled,
} from '../data/hooks';

const Education = ({
  formId,
  levelOfEducation,
  visibilityLevelOfEducation,
  editMode,
  saveState,
  error,
  changeHandler,
  submitHandler,
  closeHandler,
  openHandler,
}) => {
  const isVisibilityEnabled = useIsVisibilityEnabled();
  const intl = useIntl();

  const handleChange = useHandleChange(changeHandler);
  const handleSubmit = useHandleSubmit(submitHandler, formId);
  const handleOpen = useCloseOpenHandler(openHandler, formId);
  const handleClose = useCloseOpenHandler(closeHandler, formId);

  return (
    <SwitchContent
      className="pt-40px"
      expression={editMode}
      cases={{
        editing: (
          <div role="dialog" aria-labelledby={`${formId}-label`}>
            <form onSubmit={handleSubmit}>
              <Form.Group
                controlId={formId}
                className="m-0 pb-3"
                isInvalid={error !== null}
              >
                <p data-hj-suppress className="h5 font-weight-bold m-0 pb-2.5">
                  {intl.formatMessage(messages['profile.education.education'])}
                </p>
                <select
                  data-hj-suppress
                  className="form-control py-10px"
                  id={formId}
                  name={formId}
                  value={levelOfEducation}
                  onChange={handleChange}
                >
                  <option value=""> </option>
                  {EDUCATION_LEVELS.map(level => (
                    <option key={level} value={level}>
                      {intl.formatMessage(get(
                        messages,
                        `profile.education.levels.${level}`,
                        messages['profile.education.levels.o'],
                      ))}
                    </option>
                  ))}
                </select>
                {error !== null && (
                  <Form.Control.Feedback hasIcon={false}>
                    {error}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
              <FormControls
                visibilityId="visibilityLevelOfEducation"
                saveState={saveState}
                visibility={visibilityLevelOfEducation}
                cancelHandler={handleClose}
                changeHandler={handleChange}
              />
            </form>
          </div>
        ),
        editable: (
          <>
            <p data-hj-suppress className="h5 font-weight-bold m-0 pb-1.5">
              {intl.formatMessage(messages['profile.education.education'])}
            </p>
            <EditableItemHeader
              content={intl.formatMessage(get(
                messages,
                `profile.education.levels.${levelOfEducation}`,
                messages['profile.education.levels.o'],
              ))}
              showEditButton
              onClickEdit={handleOpen}
              showVisibility={visibilityLevelOfEducation !== null && isVisibilityEnabled}
              visibility={visibilityLevelOfEducation}
            />
          </>
        ),
        empty: (
          <>
            <p data-hj-suppress className="h5 font-weight-bold m-0 pb-1.5">
              {intl.formatMessage(messages['profile.education.education'])}
            </p>
            <EmptyContent onClick={handleOpen}>
              <FormattedMessage
                id="profile.education.empty"
                defaultMessage="Add level of education"
                description="instructions when the user doesn't have their level of education set"
              />
            </EmptyContent>
          </>
        ),
        static: (
          <>
            <p data-hj-suppress className="h5 font-weight-bold m-0 pb-1.5">
              {intl.formatMessage(messages['profile.education.education'])}
            </p>
            <EditableItemHeader
              content={intl.formatMessage(get(
                messages,
                `profile.education.levels.${levelOfEducation}`,
                messages['profile.education.levels.o'],
              ))}
            />
          </>
        ),
      }}
    />
  );
};

Education.propTypes = {
  formId: PropTypes.string.isRequired,
  levelOfEducation: PropTypes.string,
  visibilityLevelOfEducation: PropTypes.oneOf(['private', 'all_users']),
  editMode: PropTypes.oneOf(['editing', 'editable', 'empty', 'static']),
  saveState: PropTypes.string,
  error: PropTypes.string,
  changeHandler: PropTypes.func.isRequired,
  submitHandler: PropTypes.func.isRequired,
  closeHandler: PropTypes.func.isRequired,
  openHandler: PropTypes.func.isRequired,
};

Education.defaultProps = {
  editMode: 'static',
  saveState: null,
  levelOfEducation: null,
  visibilityLevelOfEducation: 'private',
  error: null,
};

export default connect(
  editableFormSelector,
  {},
)(Education);
