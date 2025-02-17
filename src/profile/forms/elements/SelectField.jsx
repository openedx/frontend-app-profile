import React from 'react';
import PropTypes from 'prop-types';
import { Form } from '@openedx/paragon';

import { connect } from 'react-redux';
import FormControls from './FormControls';
import EditableItemHeader from './EditableItemHeader';
import EmptyContent from './EmptyContent';
import SwitchContent from './SwitchContent';
import { editableFormSelector } from '../../data/selectors';

const SelectField = ({
  formId,
  value,
  visibility,
  editMode,
  saveState,
  error,
  options,
  label,
  emptyMessage,
  changeHandler,
  submitHandler,
  closeHandler,
  openHandler,
}) => {
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
            <form onSubmit={handleSubmit}>
              <Form.Group
                controlId={formId}
                isInvalid={error !== null}
              >
                <label className="edit-section-header" htmlFor={formId}>
                  {label}
                </label>
                <select
                  data-hj-suppress
                  className="form-control"
                  type="select"
                  id={formId}
                  name={formId}
                  value={value}
                  onChange={handleChange}
                >
                  <option value="">&nbsp;</option>
                  {options.map(([code, name]) => (
                    <option key={code} value={code}>{name}</option>
                  ))}
                </select>
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
            <EditableItemHeader
              content={label}
            />
            <EmptyContent onClick={handleOpen}>
              {emptyMessage}
            </EmptyContent>
          </>
        ),
        static: value && (
          <>
            <EditableItemHeader
              content={label}
            />
            <p data-hj-suppress className="h5">{value}</p>
          </>
        ),
      }}
    />
  );
};

SelectField.propTypes = {
  formId: PropTypes.string.isRequired,
  value: PropTypes.string,
  visibility: PropTypes.oneOf(['private', 'all_users']),
  editMode: PropTypes.oneOf(['editing', 'editable', 'empty', 'static']),
  saveState: PropTypes.string,
  error: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({
    code: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
  //   fieldMessages: PropTypes.objectOf(PropTypes.string).isRequired,
  label: PropTypes.string.isRequired,
  emptyMessage: PropTypes.string.isRequired,
  changeHandler: PropTypes.func.isRequired,
  submitHandler: PropTypes.func.isRequired,
  closeHandler: PropTypes.func.isRequired,
  openHandler: PropTypes.func.isRequired,
};

SelectField.defaultProps = {
  editMode: 'static',
  saveState: null,
  value: null,
  visibility: 'private',
  error: null,
};

export default connect(editableFormSelector, {})(SelectField);
