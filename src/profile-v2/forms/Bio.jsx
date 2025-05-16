import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Form } from '@openedx/paragon';

import messages from './Bio.messages';

// Components
import FormControls from './elements/FormControls';
import EditableItemHeader from './elements/EditableItemHeader';
import EmptyContent from './elements/EmptyContent';
import SwitchContent from './elements/SwitchContent';

// Selectors
import { editableFormSelector } from '../data/selectors';

const Bio = ({
  formId,
  bio,
  visibilityBio,
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
                  {intl.formatMessage(messages['profile.bio.about.me'])}
                </p>
                <textarea
                  className="form-control"
                  id={formId}
                  name={formId}
                  value={bio}
                  onChange={handleChange}
                />
                {error !== null && (
                  <Form.Control.Feedback hasIcon={false}>
                    {error}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
              <FormControls
                visibilityId="visibilityBio"
                saveState={saveState}
                visibility={visibilityBio}
                cancelHandler={handleClose}
                changeHandler={handleChange}
              />
            </form>
          </div>
        ),
        editable: (
          <>
            <p data-hj-suppress className="h5 font-weight-bold">
              {intl.formatMessage(messages['profile.bio.about.me'])}
            </p>
            <EditableItemHeader
              content={bio}
              showEditButton
              onClickEdit={handleOpen}
              showVisibility={visibilityBio !== null}
              visibility={visibilityBio}
            />
          </>
        ),
        empty: (
          <>
            <p data-hj-suppress className="h5 font-weight-bold">
              {intl.formatMessage(messages['profile.bio.about.me'])}
            </p>
            <EmptyContent onClick={handleOpen}>
              <FormattedMessage
                id="profile.bio.empty"
                defaultMessage="Add a short bio"
                description="instructions when the user hasn't written an About Me"
              />
            </EmptyContent>
          </>
        ),
        static: (
          <>
            <p data-hj-suppress className="h5 font-weight-bold">
              {intl.formatMessage(messages['profile.bio.about.me'])}
            </p>
            <EditableItemHeader content={bio} />
          </>
        ),
      }}
    />
  );
};

Bio.propTypes = {
  formId: PropTypes.string.isRequired,
  bio: PropTypes.string,
  visibilityBio: PropTypes.oneOf(['private', 'all_users']),
  editMode: PropTypes.oneOf(['editing', 'editable', 'empty', 'static']),
  saveState: PropTypes.string,
  error: PropTypes.string,
  changeHandler: PropTypes.func.isRequired,
  submitHandler: PropTypes.func.isRequired,
  closeHandler: PropTypes.func.isRequired,
  openHandler: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
};

Bio.defaultProps = {
  editMode: 'static',
  saveState: null,
  bio: null,
  visibilityBio: 'private',
  error: null,
};

export default connect(
  editableFormSelector,
  {},
)(injectIntl(Bio));