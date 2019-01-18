import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';

function EditButton({ onClick, className, style }) {
  return (
    <button
      className={classNames('btn btn-sm btn-link', className)}
      onClick={onClick}
      style={style}
    >
      <FontAwesomeIcon icon={faPencilAlt} /> Edit
    </button>
  );
}

export default EditButton;

EditButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  style: PropTypes.object, // eslint-disable-line
};

EditButton.defaultProps = {
  className: null,
  style: null,
};
