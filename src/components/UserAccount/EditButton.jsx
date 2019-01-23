import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@edx/paragon';

function EditButton({ onClick }) {
  return (
    <button className="btn btn-sm btn-link" onClick={onClick}>
      <Icon className="fa fa-pencil" /> Edit
    </button>
  );
}

export default EditButton;


EditButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};
