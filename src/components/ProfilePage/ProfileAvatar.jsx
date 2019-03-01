import React from 'react';
import PropTypes from 'prop-types';
import { Input, Spinner, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Button } from 'reactstrap';


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
    return (
      <div className="profile-avatar-menu-container">
        {this.props.src == null ? (
          <Button className="text-white btn-block" color="link" size="sm">Upload Photo</Button>
        ) : (
          <Dropdown
            isOpen={this.state.dropdownOpen}
            toggle={this.toggleDropdown}
          >
            <DropdownToggle className="text-white btn-block" color="link" size="sm">Change</DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={this.onClickUpload}>Upload Photo</DropdownItem>
              <DropdownItem onClick={this.onClickDelete}>Remove</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
      </div>
    );
  }

  render() {
    return (
      <div className="profile-avatar-wrap position-relative">
        <div className="profile-avatar rounded-circle bg-dark">
          {this.props.savePhotoState === 'pending' ? this.renderPending() : this.renderMenu() }
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
            id="exampleFile"
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
};

ProfileAvatar.defaultProps = {
  src: null,
  savePhotoState: null,
};
