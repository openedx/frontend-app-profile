import React from 'react';
import PropTypes from 'prop-types';
import { Input, Spinner, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Button } from 'reactstrap';
import { FormattedMessage } from 'react-intl';


class ProfileAvatar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dropdownOpen: false,
    };

    this.fileInput = React.createRef();
    this.form = React.createRef();

    this.onClickUpload = this.onClickUpload.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
    this.onInput = this.onInput.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
  }

  onClickUpload() {
    this.fileInput.current.click();
  }

  onClickDelete() {
    this.props.onDelete();
  }

  onInput() {
    this.onSubmit();
  }

  onSubmit(e) {
    if (e) e.preventDefault();
    this.props.onSave(new FormData(this.form.current));
  }

  toggleDropdown() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  }

  renderPending() {
    return (
      <div
        className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center rounded-circle"
        style={{ backgroundColor: 'rgba(0,0,0,.65)' }}
      >
        <Spinner color="primary" />
      </div>
    );
  }

  renderMenu() {
    if (!this.props.isEditable) return null;

    if (this.props.src === null) {
      return (
        <Button className="text-white btn-block" color="link" size="sm">
          <FormattedMessage
            id="profile.profileavatar.upload-button"
            defaultMessage="Upload Photo"
            description="Upload photo button"
          />
        </Button>
      );
    }

    return (
      <Dropdown
        isOpen={this.state.dropdownOpen}
        toggle={this.toggleDropdown}
      >
        <DropdownToggle className="text-white btn-block" color="link" size="sm">
          <FormattedMessage
            id="profile.profileavatar.change-button"
            defaultMessage="Change"
            description="Change photo button"
          />
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem onClick={this.onClickUpload}>
            <FormattedMessage
              id="profile.profileavatar.upload-button"
              defaultMessage="Upload Photo"
              description="Upload photo button"
            />
          </DropdownItem>
          <DropdownItem onClick={this.onClickDelete}>
            <FormattedMessage
              id="profile.profileavatar.remove.button"
              defaultMessage="Remove"
              description="Remove photo button"
            />
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  }

  render() {
    return (
      <div className="profile-avatar-wrap position-relative">
        <div className="profile-avatar rounded-circle bg-dark">
          <div className="profile-avatar-menu-container">
            {this.props.savePhotoState === 'pending' ? this.renderPending() : this.renderMenu() }
          </div>
          <img
            className="w-100 h-100 d-block rounded-circle overflow-hidden"
            style={{ objectFit: 'cover' }}
            alt="profile avatar"
            src={this.props.src}
          />
        </div>
        <form
          ref={this.form}
          onSubmit={this.onSubmit}
          encType="multipart/form-data"
        >
          {/* The name of this input must be 'file' */}
          <Input
            className="d-none"
            innerRef={this.fileInput}
            type="file"
            name="file"
            id="photo-file"
            onInput={this.onInput}
            accept=".jpg, .jpeg, .png"
          />
        </form>
      </div>
    );
  }
}


export default ProfileAvatar;

ProfileAvatar.propTypes = {
  src: PropTypes.string,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  savePhotoState: PropTypes.oneOf([null, 'pending', 'complete', 'error']),
  isEditable: PropTypes.bool,
};

ProfileAvatar.defaultProps = {
  src: null,
  savePhotoState: null,
  isEditable: false,
};
