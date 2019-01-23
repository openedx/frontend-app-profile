import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Icon } from '@edx/paragon';

function EditButton({ onClick, className, style }) {
  return (
    <button
      className={classNames('btn btn-sm btn-link', className)}
      onClick={onClick}
      style={style}
    >
      <Icon className="fa fa-pencil" /> Edit
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
