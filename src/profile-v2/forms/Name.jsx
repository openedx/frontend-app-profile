import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import messages from './Name.messages';

// Components
import FormControls from './elements/FormControls';
import EditableItemHeader from './elements/EditableItemHeader';
import EmptyContent from './elements/EmptyContent';
import SwitchContent from './elements/SwitchContent';

// Selectors
import { editableFormSelector } from '../data/selectors';

const Name = ({
  formId,
  name,
  visibilityName,
  editMode,
  saveState,
  changeHandler,
  submitHandler,
  closeHandler,
  openHandler,
  intl,
}) => {
  const handleChange = (e) => {
    const { name: inputName, value } = e.target;
    changeHandler(inputName, value);
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
              <div className="form-group">
                <p data-hj-suppress className="h5 font-weight-bold m-0 pb-0375rem">{intl.formatMessage(messages['profile.name.full.name'])}</p>
                <EditableItemHeader content={name} />
              </div>
              <FormControls
                visibilityId="visibilityName"
                saveState={saveState}
                visibility={visibilityName}
                cancelHandler={handleClose}
                changeHandler={handleChange}
              />
            </form>
          </div>
        ),
        editable: (
          <>
            <p data-hj-suppress className="h5 font-weight-bold m-0 pb-0375rem">{intl.formatMessage(messages['profile.name.full.name'])}</p>
            <EditableItemHeader
              content={name}
              showEditButton
              onClickEdit={handleOpen}
              showVisibility={visibilityName !== null}
              visibility={visibilityName}
            />
          </>
        ),
        empty: (
          <>
            <p data-hj-suppress className="h5 font-weight-bold m-0 pb-0375rem">{intl.formatMessage(messages['profile.name.full.name'])}</p>
            <EmptyContent onClick={handleOpen}>
              {intl.formatMessage(messages['profile.name.empty'])}
            </EmptyContent>
          </>
        ),
        static: (
          <>
            <p data-hj-suppress className="h5 font-weight-bold m-0 pb-0375rem">{intl.formatMessage(messages['profile.name.full.name'])}</p>
            <EditableItemHeader content={name} />
          </>
        ),
      }}
    />
  );
};

Name.propTypes = {
  formId: PropTypes.string.isRequired,
  name: PropTypes.string,
  visibilityName: PropTypes.oneOf(['private', 'all_users']),
  editMode: PropTypes.oneOf(['editing', 'editable', 'empty', 'static']),
  saveState: PropTypes.string,
  changeHandler: PropTypes.func.isRequired,
  submitHandler: PropTypes.func.isRequired,
  closeHandler: PropTypes.func.isRequired,
  openHandler: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
};

Name.defaultProps = {
  editMode: 'static',
  saveState: null,
  name: null,
  visibilityName: 'private',
};

export default connect(
  editableFormSelector,
  {},
)(injectIntl(Name));
