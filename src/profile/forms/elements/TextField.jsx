import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Components
import { Form } from '@openedx/paragon';
import FormControls from './FormControls';
import EditableItemHeader from './EditableItemHeader';
import EmptyContent from './EmptyContent';
import SwitchContent from './SwitchContent';

// Selectors
import { editableFormSelector } from '../../data/selectors';

const TextField = ({
  formId,
  value,
  visibility,
  editMode,
  saveState,
  error,
  options,
  label,
  emptyMessage,
  fieldMessages,
  placeholder,
  instructions,
  changeHandler,
  submitHandler,
  closeHandler,
  openHandler,
}) => {
  const handleChange = (e) => {
    const { name: selected, value: newValue } = e.target;
    changeHandler(selected, newValue);
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
                <label className="edit-section-header" htmlFor={formId}>
                  {label}
                </label>
                <input
                  className="form-control"
                  id={formId}
                  name={formId}
                  value={value}
                  onChange={handleChange}
                />
                {error !== null && (
                <Form.Control.Feedback hasIcon={false}>
                  {error}
                </Form.Control.Feedback>
                )}
              </Form.Group>
              <FormControls
                saveState={saveState}
                // visibility={visibilityBio}
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
        // empty: (
        //   <>
        //     <EditableItemHeader content={intl.formatMessage(messages['profile.name.full.name'])} />
        //     <EmptyContent onClick={handleOpen}>
        //       {intl.formatMessage(messages['profile.name.empty'])}
        //     </EmptyContent>
        //     <small className="form-text text-muted">
        //       {intl.formatMessage(messages['profile.name.details'])}
        //     </small>
        //   </>
        // ),
        // static: (
        //   <>
        //     <EditableItemHeader content={intl.formatMessage(messages['profile.name.full.name'])} />
        //     <p data-hj-suppress className="h5">{name}</p>
        //   </>
        // ),
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
  error: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({
    code: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
  fieldMessages: PropTypes.objectOf(PropTypes.string).isRequired,
  label: PropTypes.string.isRequired,
  emptyMessage: PropTypes.string.isRequired,
  changeHandler: PropTypes.func.isRequired,
  submitHandler: PropTypes.func.isRequired,
  closeHandler: PropTypes.func.isRequired,
  openHandler: PropTypes.func.isRequired,
};

TextField.defaultProps = {
  editMode: 'static',
  saveState: null,
  value: null,
  visibility: 'private',
  error: null,
};

export default connect(
  editableFormSelector,
  {},
)(TextField);
