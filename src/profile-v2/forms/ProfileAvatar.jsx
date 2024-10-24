import React from 'react';
import PropTypes from 'prop-types';
import { Button, Dropdown } from '@openedx/paragon';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import { ReactComponent as DefaultAvatar } from '../assets/avatar.svg';

import messages from './ProfileAvatar.messages';

class ProfileAvatar extends React.Component {
  constructor(props) {
    super(props);

    this.fileInput = React.createRef();
    this.form = React.createRef();

    this.onClickUpload = this.onClickUpload.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
    this.onChangeInput = this.onChangeInput.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onClickUpload() {
    this.fileInput.current.click();
  }

  onClickDelete() {
    this.props.onDelete();
  }

  onChangeInput() {
    this.onSubmit();
  }

  onSubmit(e) {
    if (e) {
      e.preventDefault();
    }
    this.props.onSave(new FormData(this.form.current));
    this.form.current.reset();
  }

  renderPending() {
    return (
      <div
        className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center rounded-circle"
        style={{ backgroundColor: 'rgba(0,0,0,.65)' }}
      >
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  renderMenuContent() {
    const { intl } = this.props;

    if (this.props.isDefault) {
      return (
        <Button
          variant="link"
          size="sm"
          className="text-white btn-block"
          onClick={this.onClickUpload}
        >
          <FormattedMessage
            id="profile.profileavatar.upload-button"
            defaultMessage="Upload Photo"
            description="Upload photo button"
          />
        </Button>
      );
    }

    return (
      <Dropdown>
        <Dropdown.Toggle>
          {intl.formatMessage(messages['profile.profileavatar.change-button'])}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item type="button" onClick={this.onClickUpload}>
            <FormattedMessage
              id="profile.profileavatar.upload-button"
              defaultMessage="Upload Photo"
              description="Upload photo button"
            />
          </Dropdown.Item>
          <Dropdown.Item type="button" onClick={this.onClickDelete}>
            <FormattedMessage
              id="profile.profileavatar.remove.button"
              defaultMessage="Remove"
              description="Remove photo button"
            />
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  renderMenu() {
    if (!this.props.isEditable) {
      return null;
    }

    return (
      <div className="profile-avatar-menu-container">
        {this.renderMenuContent()}
      </div>
    );
  }

  renderAvatar() {
    const { intl } = this.props;

    return this.props.isDefault ? (
      <DefaultAvatar className="text-muted" role="img" aria-hidden focusable="false" viewBox="0 0 24 24" />
    ) : (
      <img
        data-hj-suppress
        className="w-100 h-100 d-block rounded-circle overflow-hidden"
        style={{ objectFit: 'cover' }}
        alt={intl.formatMessage(messages['profile.image.alt.attribute'])}
        src={this.props.src}
      />
    );
  }

  render() {
    return (
      <div className="profile-avatar-wrap position-relative">
        <div className="profile-avatar rounded-circle bg-light">
          {this.props.savePhotoState === 'pending' ? this.renderPending() : this.renderMenu() }
          {this.renderAvatar()}
        </div>
        <form
          ref={this.form}
          onSubmit={this.onSubmit}
          encType="multipart/form-data"
        >
          {/* The name of this input must be 'file' */}
          <input
            className="d-none form-control-file"
            ref={this.fileInput}
            type="file"
            name="file"
            id="photo-file"
            onChange={this.onChangeInput}
            accept=".jpg, .jpeg, .png"
          />
        </form>
      </div>
    );
  }
}

export default injectIntl(ProfileAvatar);

ProfileAvatar.propTypes = {
  src: PropTypes.string,
  isDefault: PropTypes.bool,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  savePhotoState: PropTypes.oneOf([null, 'pending', 'complete', 'error']),
  isEditable: PropTypes.bool,
  intl: intlShape.isRequired,
};

ProfileAvatar.defaultProps = {
  src: null,
  isDefault: true,
  savePhotoState: null,
  isEditable: false,
};
