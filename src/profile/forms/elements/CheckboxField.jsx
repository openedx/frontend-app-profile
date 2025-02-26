/* eslint-disable react/no-danger */
import React from 'react';
import DOMPurify from 'dompurify';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form } from '@openedx/paragon';

import { editableFormSelector } from '../../data/selectors';

// Components
import FormControls from './FormControls';
import EditableItemHeader from './EditableItemHeader';
import EmptyContent from './EmptyContent';
import SwitchContent from './SwitchContent';

const CheckboxField = ({
  formId,
  value,
  visibility,
  editMode,
  saveState,
  error,
  label,
  placeholder,
  instructions,
  changeHandler,
  submitHandler,
  closeHandler,
  openHandler,
}) => {
  const handleChange = (e) => {
    const { name, checked: newValue } = e.target;
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
                isInvalid={error !== null}
              >
                <Form.Checkbox
                  id={formId}
                  name={formId}
                  checked={value}
                  onChange={handleChange}
                >
                  <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(label) }} />
                </Form.Checkbox>
                {error !== null && (
                <Form.Control.Feedback hasIcon={false}>
                  {error}
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
              />
            </form>
          </div>
        ),
        editable: (
          <>
            <EditableItemHeader
              content={(
                <Form.Checkbox
                  id={formId}
                  name={formId}
                  checked={value}
                >
                  <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(label) }} />
                </Form.Checkbox>
              )}
              showEditButton
              onClickEdit={handleOpen}
              showVisibility={false}
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
            <EditableItemHeader
              content={(
                <Form.Checkbox
                  id={formId}
                  name={formId}
                  checked={value}
                >
                  <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(label) }} />
                </Form.Checkbox>
              )}
              showVisibility={false}
            />
            <p data-hj-suppress className="h5">{value}</p>
          </>
        ),
      }}
    />
  );
};

CheckboxField.propTypes = {
  formId: PropTypes.string.isRequired,
  value: PropTypes.bool,
  visibility: PropTypes.oneOf(['private', 'all_users']),
  editMode: PropTypes.oneOf(['editing', 'editable', 'empty', 'static']),
  saveState: PropTypes.string,
  error: PropTypes.string,
  placeholder: PropTypes.string,
  instructions: PropTypes.string,
  label: PropTypes.string.isRequired,
  changeHandler: PropTypes.func.isRequired,
  submitHandler: PropTypes.func.isRequired,
  closeHandler: PropTypes.func.isRequired,
  openHandler: PropTypes.func.isRequired,
};

CheckboxField.defaultProps = {
  editMode: 'static',
  saveState: null,
  value: false,
  placeholder: '',
  instructions: '',
  visibility: 'private',
  error: null,
};

export default connect(editableFormSelector, {})(CheckboxField);

export const TestableCheckboxField = CheckboxField;
