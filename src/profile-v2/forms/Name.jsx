import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useIntl } from '@edx/frontend-platform/i18n';

import { InfoOutline } from '@openedx/paragon/icons';
import { Hyperlink, OverlayTrigger, Tooltip } from '@openedx/paragon';
import messages from './Name.messages';

import FormControls from './elements/FormControls';
import EditableItemHeader from './elements/EditableItemHeader';
import EmptyContent from './elements/EmptyContent';
import SwitchContent from './elements/SwitchContent';

import { editableFormSelector } from '../data/selectors';
import {
  useCloseOpenHandler,
  useHandleChange,
  useHandleSubmit,
  useIsVisibilityEnabled,
} from '../data/hooks';

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
  accountSettingsUrl,
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
              <div className="form-group">
                <div className="row m-0 pb-2.5 align-items-center">
                  <p data-hj-suppress className="h5 font-weight-bold m-0">
                    {intl.formatMessage(messages['profile.name.full.name'])}
                  </p>
                  <OverlayTrigger
                    key="top"
                    placement="top"
                    overlay={(
                      <Tooltip variant="light" id="tooltip-top">
                        <p className="h5 font-weight-normal m-0 p-0">
                          {intl.formatMessage(messages['profile.name.tooltip'])}
                        </p>
                      </Tooltip>
                            )}
                  >
                    <InfoOutline className="m-0 info-icon" />
                  </OverlayTrigger>
                </div>
                <EditableItemHeader content={name} />
                <h4 className="font-weight-normal">
                  <Hyperlink destination={accountSettingsUrl} target="_blank">
                    {intl.formatMessage(messages['profile.name.redirect'])}
                  </Hyperlink>
                </h4>
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
            <div className="row m-0 pb-1.5 align-items-center">
              <p data-hj-suppress className="h5 font-weight-bold m-0">
                {intl.formatMessage(messages['profile.name.full.name'])}
              </p>
              <OverlayTrigger
                key="top"
                placement="top"
                overlay={(
                  <Tooltip variant="light" id="tooltip-top">
                    <p className="h5 font-weight-normal m-0 p-0">
                      {intl.formatMessage(messages['profile.name.tooltip'])}
                    </p>
                  </Tooltip>
                          )}
              >
                <InfoOutline className="m-0 info-icon" />
              </OverlayTrigger>
            </div>
            <EditableItemHeader
              content={name}
              showEditButton
              onClickEdit={handleOpen}
              showVisibility={visibilityName !== null && isVisibilityEnabled}
              visibility={visibilityName}
            />
          </>
        ),
        empty: (
          <>
            <div className="row m-0 pb-1.5 align-items-center">
              <p data-hj-suppress className="h5 font-weight-bold m-0">
                {intl.formatMessage(messages['profile.name.full.name'])}
              </p>
              <OverlayTrigger
                key="top"
                placement="top"
                overlay={(
                  <Tooltip variant="light" id="tooltip-top">
                    <p className="h5 font-weight-normal m-0 p-0">
                      {intl.formatMessage(messages['profile.name.tooltip'])}
                    </p>
                  </Tooltip>
                          )}
              >
                <InfoOutline className="m-0 info-icon" />
              </OverlayTrigger>
            </div>
            <EmptyContent onClick={handleOpen}>
              {intl.formatMessage(messages['profile.name.empty'])}
            </EmptyContent>
          </>
        ),
        static: (
          <>
            <div className="row m-0 pb-1.5 align-items-center">
              <p data-hj-suppress className="h5 font-weight-bold m-0">
                {intl.formatMessage(messages['profile.name.full.name'])}
              </p>
              <OverlayTrigger
                key="top"
                placement="top"
                overlay={(
                  <Tooltip variant="light" id="tooltip-top">
                    <p className="h5 font-weight-normal m-0 p-0">
                      {intl.formatMessage(messages['profile.name.tooltip'])}
                    </p>
                  </Tooltip>
                          )}
              >
                <InfoOutline className="m-0 info-icon" />
              </OverlayTrigger>
            </div>
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
  accountSettingsUrl: PropTypes.string.isRequired,
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
)(Name);
