import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from '@openedx/frontend-base';
import { Form } from '@openedx/paragon';

import classNames from 'classnames';
import messages from '@src/profile/forms/Bio.messages';

import FormControls from '@src/profile/forms/elements/FormControls';
import EditableItemHeader from '@src/profile/forms/elements/EditableItemHeader';
import EmptyContent from '@src/profile/forms/elements/EmptyContent';
import SwitchContent from '@src/profile/forms/elements/SwitchContent';

import {
  useCloseOpenHandler,
  useEditableForm,
  useHandleChange,
  useHandleSubmit,
  useIsOnMobileScreen,
  useIsVisibilityEnabled,
} from '@src/profile/data/hooks';

const Bio = ({
  formId,
  bio,
  visibilityBio,
  changeHandler,
  submitHandler,
  closeHandler,
  openHandler,
}) => {
  const isMobileView = useIsOnMobileScreen();
  const isVisibilityEnabled = useIsVisibilityEnabled();
  const intl = useIntl();
  const { editMode, error, saveState } = useEditableForm(formId);

  const handleChange = useHandleChange(changeHandler);
  const handleSubmit = useHandleSubmit(submitHandler, formId);
  const handleOpen = useCloseOpenHandler(openHandler, formId);
  const handleClose = useCloseOpenHandler(closeHandler, formId);

  return (
    <SwitchContent
      className={classNames([
        isMobileView ? 'pt-40px' : 'pt-0',
      ])}
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
                  {intl.formatMessage(messages['profile.bio.about.me'])}
                </p>
                <textarea
                  className="form-control py-10px"
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
            <p data-hj-suppress className="h5 font-weight-bold m-0 pb-1.5">
              {intl.formatMessage(messages['profile.bio.about.me'])}
            </p>
            <EditableItemHeader
              content={bio}
              showEditButton
              onClickEdit={handleOpen}
              showVisibility={visibilityBio !== null && isVisibilityEnabled}
              visibility={visibilityBio}
            />
          </>
        ),
        empty: (
          <>
            <p data-hj-suppress className="h5 font-weight-bold m-0 pb-1.5">
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
            <p data-hj-suppress className="h5 font-weight-bold m-0 pb-1.5">
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
  changeHandler: PropTypes.func.isRequired,
  submitHandler: PropTypes.func.isRequired,
  closeHandler: PropTypes.func.isRequired,
  openHandler: PropTypes.func.isRequired,
};

Bio.defaultProps = {
  bio: null,
  visibilityBio: 'private',
};

export default Bio;
