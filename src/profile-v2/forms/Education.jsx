import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import get from 'lodash.get';
import { Form } from '@openedx/paragon';

import messages from './Education.messages';

// Components
import FormControls from './elements/FormControls';
import EditableItemHeader from './elements/EditableItemHeader';
import EmptyContent from './elements/EmptyContent';
import SwitchContent from './elements/SwitchContent';

// Constants
import { EDUCATION_LEVELS } from '../data/constants';

// Selectors
import { editableFormSelector } from '../data/selectors';

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
  intl,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    changeHandler(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitHandler(formId);
  };

  const handleClose = () => {
    closeHandler(formId);
  };

  const handleOpen = () => {
    openHandler(formId);
  };

  return (
    <SwitchContent
      className="mb-5"
      expression={editMode}
      cases={{
        editing: (
          <div role="dialog" aria-labelledby={`${formId}-label`}>
            <form onSubmit={handleSubmit}>
              <Form.Group
                controlId={formId}
                isInvalid={error !== null}
              >
                <p data-hj-suppress className="h5 font-weight-bold">
                  {intl.formatMessage(messages['profile.education.education'])}
                </p>
                <select
                  data-hj-suppress
                  className="form-control"
                  id={formId}
                  name={formId}
                  value={levelOfEducation}
                  onChange={handleChange}
                >
ibble                  <option value=""> </option>
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
            <p data-hj-suppress className="h5 font-weight-bold">
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
              showVisibility={visibilityLevelOfEducation !== null}
              visibility={visibilityLevelOfEducation}
            />
          </>
        ),
        empty: (
          <>
            <p data-hj-suppress className="h5 font-weight-bold">
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
            <p data-hj-suppress className="h5 font-weight-bold">
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
  intl: intlShape.isRequired,
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
)(injectIntl(Education));
