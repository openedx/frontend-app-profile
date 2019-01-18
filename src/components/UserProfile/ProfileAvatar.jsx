import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';

class ProfileAvatar extends React.Component {
  constructor(props) {
    super(props);

    this.fileInput = React.createRef();
    this.form = React.createRef();

    this.onClick = this.onClick.bind(this);
    this.onInput = this.onInput.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onClick() {
    this.fileInput.current.click();
  }

  onInput(e) { // eslint-disable-line no-unused-vars
    // console.log('input', e)
    this.form.current.submit();
  }

  onChange(e) { // eslint-disable-line no-unused-vars
    // console.log('change', e)
  }

  onSubmit(e) { // eslint-disable-line no-unused-vars
    // console.log('onsubmit', e);
  }

  render() {
    const {
      src,
    } = this.props;

    return (
      <div className="profile-avatar rounded-circle overflow-hidden">
        <button
          className="text-white profile-avatar-edit-button"
          onClick={this.onClick}
        >
          Update
        </button>
        <img className="w-100" src={src} alt="profile avatar" />
        <form
          ref={this.form}
          onSubmit={this.onSubmit}
          method="post"
          encType="multipart/form-data"
        >
          <Input
            className="d-none"
            innerRef={this.fileInput}
            type="file"
            name="file"
            id="exampleFile"
            onInput={this.onInput}
            onChange={this.onChange}
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
};

ProfileAvatar.defaultProps = {
  src: null,
};
