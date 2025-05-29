import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Dropdown,
  IconButton,
  Icon,
  Tooltip,
  OverlayTrigger,
} from '@openedx/paragon';
import { FormattedMessage, useIntl } from '@edx/frontend-platform/i18n';

import { PhotoCamera } from '@openedx/paragon/icons';
import { ReactComponent as DefaultAvatar } from '../assets/avatar.svg';
import messages from './ProfileAvatar.messages';

const ProfileAvatar = ({
  src,
  isDefault,
  onSave,
  onDelete,
  savePhotoState,
  isEditable,
}) => {
  const intl = useIntl();
  const fileInput = useRef(null);
  const form = useRef(null);

  const onClickUpload = () => {
    fileInput.current.click();
  };

  const onClickDelete = () => {
    onDelete();
  };

  const onSubmit = (e) => {
    if (e) {
      e.preventDefault();
    }
    onSave(new FormData(form.current));
    form.current.reset();
  };

  const onChangeInput = () => {
    onSubmit();
  };

  const renderPending = () => (
    <div
      className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center rounded-circle bg-black bg-opacity-65"
    >
      <div className="spinner-border text-primary" role="status" />
    </div>
  );

  const renderEditButton = () => {
    if (!isEditable) {
      return null;
    }

    return (
      <div className="profile-avatar-button">
        <Dropdown>
          <OverlayTrigger
            key="top"
            placement="top"
            overlay={(
              <Tooltip variant="light" id="tooltip-top">
                {!isDefault ? (
                  <p className="h5 font-weight-normal m-0 p-0">
                    {intl.formatMessage(messages['profile.profileavatar.tooltip.edit'])}
                  </p>
                ) : (
                  <p className="h5 font-weight-normal m-0 p-0">
                    {intl.formatMessage(messages['profile.profileavatar.tooltip.upload'])}
                  </p>
                )}
              </Tooltip>
              )}
          >
            <Dropdown.Toggle
              invertColors
              isActive
              id="dropdown-toggle-with-iconbutton"
              as={IconButton}
              src={PhotoCamera}
              iconAs={Icon}
              variant="primary"
              className="shadow-sm"
            />
          </OverlayTrigger>
          <Dropdown.Menu className="min-width-179px p-0 m-0">
            <Dropdown.Item type="button" onClick={onClickUpload}>
              <FormattedMessage
                id="profile.profileavatar.upload-button"
                defaultMessage="Upload photo"
                description="Upload photo button"
              />
            </Dropdown.Item>
            {!isDefault && (
              <Dropdown.Item type="button" onClick={onClickDelete}>
                <FormattedMessage
                  id="profile.profileavatar.remove.button"
                  defaultMessage="Remove photo"
                  description="Remove photo button"
                />
              </Dropdown.Item>
            )}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  };

  const renderAvatar = () => (
    isDefault ? (
      <DefaultAvatar className="text-muted" role="img" aria-hidden focusable="false" viewBox="0 0 24 24" />
    ) : (
      <img
        data-hj-suppress
        className="w-100 h-100 d-block rounded-circle overflow-hidden object-fit-cover"
        alt={intl.formatMessage(messages['profile.image.alt.attribute'])}
        src={src}
      />
    )
  );

  return (
    <div className="profile-avatar-wrap position-relative">
      <div className="profile-avatar rounded-circle bg-light">
        {savePhotoState === 'pending' && renderPending()}
        {renderAvatar()}
      </div>
      {renderEditButton()}
      <form
        ref={form}
        onSubmit={onSubmit}
        encType="multipart/form-data"
      >
        <input
          className="d-none form-control-file"
          ref={fileInput}
          type="file"
          name="file"
          id="photo-file"
          onChange={onChangeInput}
          accept=".jpg, .jpeg, .png"
        />
      </form>
    </div>
  );
};

ProfileAvatar.propTypes = {
  src: PropTypes.string,
  isDefault: PropTypes.bool,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  savePhotoState: PropTypes.oneOf([null, 'pending', 'complete', 'error']),
  isEditable: PropTypes.bool,
};

ProfileAvatar.defaultProps = {
  src: null,
  isDefault: true,
  savePhotoState: null,
  isEditable: false,
};

export default ProfileAvatar;
