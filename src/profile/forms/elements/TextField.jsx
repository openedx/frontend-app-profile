import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// Components
import { Form } from '@openedx/paragon';
import { connect } from 'react-redux';
import FormControls from './FormControls';
import EditableItemHeader from './EditableItemHeader';
import EmptyContent from './EmptyContent';
import SwitchContent from './SwitchContent';
import { editableFormSelector } from '../../data/selectors';

const TextField = ({
  formId,
  value,
  visibility,
  editMode,
  saveState,
  label,
  placeholder,
  instructions,
  restrictions,
  errorMessage,
  changeHandler,
  submitHandler,
  closeHandler,
  openHandler,
}) => {
  const [displayedMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!value && errorMessage?.required) {
      setErrorMessage(errorMessage.required);
    } else if (restrictions.max_length && value.length > restrictions.max_length) {
      setErrorMessage(errorMessage.max_length);
    } else if (restrictions.min_length && value.length < restrictions.min_length) {
      setErrorMessage(errorMessage.min_length);
    } else {
      setErrorMessage(null);
    }
  }, [
    errorMessage.max_length,
    errorMessage.min_length,
    errorMessage.required,
    restrictions.max_length,
    restrictions.min_length,
    value,
  ]);

  const handleChange = (e) => {
    const { name, value: newValue } = e.target;
    changeHandler(name, newValue);
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
      expression={editMode}
      cases={{
        editing: (
          <div role="dialog" aria-labelledby={`${formId}-label`}>
            <form data-testid="test-form" onSubmit={handleSubmit}>
              <Form.Group
                controlId={formId}
                isInvalid={displayedMessage !== null}
              >
                <label className="edit-section-header" htmlFor={formId}>
                  {label}
                </label>
                <input
                  className="form-control"
                  id={formId}
                  name={formId}
                  value={value}
                  onChange={handleChange}
                  minLength={restrictions.min_length}
                  maxLength={restrictions.max_length}
                />
                {displayedMessage !== null && (
                <Form.Control.Feedback hasIcon={false}>
                  {displayedMessage}
                </Form.Control.Feedback>
                )}
              </Form.Group>
              <FormControls
                // TODO: Modify api/user/v1/accounts/{username} so it returns extended_profile_fields for no owners
                // visibilityId={`visibility${capitalizeFirstLetter(formId)}`}
                showVisibilitySelect={false}
                saveState={saveState}
                cancelHandler={handleClose}
                changeHandler={handleChange}
                disabled={displayedMessage !== null}
              />
            </form>
          </div>
        ),
        editable: (
          <>
            <EditableItemHeader
              content={label}
              showEditButton
              onClickEdit={handleOpen}
              showVisibility={visibility !== null}
              visibility={visibility}
            />
            <p data-hj-suppress className="h5">{value}</p>
          </>
        ),
        empty: (
          <>
            <EditableItemHeader content={label} />
            <EmptyContent onClick={handleOpen}>
              {instructions}
            </EmptyContent>
            <small className="form-text text-muted">
              {placeholder}
            </small>
          </>
        ),
        static: value && (
          <>
            <EditableItemHeader content={label} />
            <p data-hj-suppress className="h5">{value}</p>
          </>
        ),
      }}
    />
  );
};

TextField.propTypes = {
  formId: PropTypes.string.isRequired,
  value: PropTypes.string,
  visibility: PropTypes.oneOf(['private', 'all_users']),
  editMode: PropTypes.oneOf(['editing', 'editable', 'empty', 'static']),
  saveState: PropTypes.string,
  errorMessage: PropTypes.shape({
    required: PropTypes.string,
    max_length: PropTypes.string,
    min_length: PropTypes.string,
  }),
  restrictions: PropTypes.shape({
    max_length: PropTypes.number,
    min_length: PropTypes.number,
  }),
  placeholder: PropTypes.string,
  instructions: PropTypes.string,
  label: PropTypes.string.isRequired,
  changeHandler: PropTypes.func.isRequired,
  submitHandler: PropTypes.func.isRequired,
  closeHandler: PropTypes.func.isRequired,
  openHandler: PropTypes.func.isRequired,
};

TextField.defaultProps = {
  editMode: 'static',
  saveState: null,
  value: null,
  placeholder: '',
  instructions: '',
  visibility: 'private',
};

export default connect(editableFormSelector, {})(TextField);

export const TestableTextField = TextField;
