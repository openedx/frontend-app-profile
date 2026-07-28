import React, { forwardRef, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  Dropdown,
  Icon,
  Tooltip,
  OverlayTrigger,
} from '@openedx/paragon';
import { FormattedMessage, useIntl } from '@edx/frontend-platform/i18n';
import { Delete, PhotoCamera } from '@openedx/paragon/icons';

import { ReactComponent as DefaultAvatar } from '../assets/avatar.svg';
import messages from './ProfileAvatar.messages';

// Custom toggle so Paragon does not render a styled Button / caret.
const AvatarMenuToggle = forwardRef(({
  children, className, disabled, onClick, ...props
}, ref) => (
  <button
    type="button"
    ref={ref}
    className={className}
    disabled={disabled}
    onClick={onClick}
    {...props}
  >
    {children}
  </button>
));

AvatarMenuToggle.displayName = 'AvatarMenuToggle';

AvatarMenuToggle.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

AvatarMenuToggle.defaultProps = {
  children: null,
  className: undefined,
  disabled: false,
  onClick: undefined,
};

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
  const isPending = savePhotoState === 'pending';

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
      className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center rounded-circle background-black-65"
    >
      <div className="spinner-border text-primary" role="status" />
    </div>
  );

  const renderAvatarImage = ({ decorative = false } = {}) => (
    isDefault ? (
      <DefaultAvatar className="text-muted w-100 h-100" role="img" aria-hidden focusable="false" viewBox="0 0 24 24" />
    ) : (
      <img
        data-hj-suppress
        className="w-100 h-100 d-block rounded-circle overflow-hidden object-fit-cover"
        alt={decorative ? '' : intl.formatMessage(messages['profile.image.alt.attribute'])}
        src={src}
      />
    )
  );

  const renderStaticAvatar = () => (
    <div className="profile-avatar rounded-circle bg-light">
      {isPending && renderPending()}
      {renderAvatarImage()}
    </div>
  );

  const renderEditableAvatar = () => {
    const tooltipMessage = !isDefault
      ? messages['profile.profileavatar.tooltip.edit']
      : messages['profile.profileavatar.tooltip.upload'];

    return (
      <Dropdown>
        <OverlayTrigger
          key="top"
          placement="top"
          overlay={(
            <Tooltip variant="light" id="profile-avatar-tooltip">
              <p className="h5 font-weight-normal m-0 p-0">
                {intl.formatMessage(tooltipMessage)}
              </p>
            </Tooltip>
          )}
        >
          <Dropdown.Toggle
            as={AvatarMenuToggle}
            id="profile-avatar-dropdown"
            className={classNames(
              'profile-avatar-toggle',
              { 'profile-avatar-toggle--pending': isPending },
            )}
            disabled={isPending}
            aria-label={intl.formatMessage(tooltipMessage)}
          >
            <span className="profile-avatar rounded-circle bg-light">
              {isPending && renderPending()}
              {renderAvatarImage({ decorative: true })}
              {!isPending && (
                <span className="profile-avatar-toggle__cue" aria-hidden="true">
                  <Icon src={PhotoCamera} className="profile-avatar-toggle__cue-icon" />
                </span>
              )}
            </span>
          </Dropdown.Toggle>
        </OverlayTrigger>
        <Dropdown.Menu className="profile-avatar-dropdown-menu">
          <Dropdown.Item
            type="button"
            className="profile-avatar-dropdown-menu__item"
            onClick={onClickUpload}
          >
            <Icon src={PhotoCamera} className="profile-avatar-dropdown-menu__icon" />
            <FormattedMessage
              id="profile.profileavatar.upload-button"
              defaultMessage="Upload photo"
              description="Upload photo button"
            />
          </Dropdown.Item>
          {!isDefault && (
            <Dropdown.Item
              type="button"
              className="profile-avatar-dropdown-menu__item profile-avatar-dropdown-menu__item--danger"
              onClick={onClickDelete}
            >
              <Icon src={Delete} className="profile-avatar-dropdown-menu__icon" />
              <FormattedMessage
                id="profile.profileavatar.remove.button"
                defaultMessage="Remove photo"
                description="Remove photo button"
              />
            </Dropdown.Item>
          )}
        </Dropdown.Menu>
      </Dropdown>
    );
  };

  return (
    <div className="profile-avatar-wrap">
      {isEditable ? renderEditableAvatar() : renderStaticAvatar()}
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
