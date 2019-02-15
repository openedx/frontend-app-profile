import React from 'react';
import PropTypes from 'prop-types';
import { Input, Spinner } from 'reactstrap';

class ProfileAvatar extends React.Component {
  constructor(props) {
    super(props);

    this.fileInput = React.createRef();
    this.form = React.createRef();

    this.onClick = this.onClick.bind(this);
    this.onInput = this.onInput.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onClick() {
    this.fileInput.current.click();
  }

  onInput() {
    this.onSubmit();
  }

  onSubmit(e) {
    if (e) e.preventDefault();
    this.props.onSave(new FormData(this.form.current));
  }

  render() {
    const {
      src,
    } = this.props;

    return (
      <div className="profile-avatar rounded-circle overflow-hidden p-relative bg-dark">
        {this.props.savePhotoState === 'pending' ? (
          <div
            className="p-absolute w-100 h-100 d-flex justify-content-center align-items-center"
            style={{ backgroundColor: 'rgba(255,255,255,.5)' }}
          >
            <Spinner color="primary" />
          </div>
        ) : null}

        <button
          className="text-white profile-avatar-edit-button"
          onClick={this.onClick}
        >
          Change
        </button>

        <form
          ref={this.form}
          onSubmit={this.onSubmit}
          encType="multipart/form-data"
        >
          <img className="w-100" src={src} alt="profile avatar" />

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
  savePhotoState: PropTypes.oneOf([null, 'pending', 'complete', 'error']).isRequired,
};

ProfileAvatar.defaultProps = {
  src: null,
};
