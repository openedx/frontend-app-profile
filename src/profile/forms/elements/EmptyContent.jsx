import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const EmptyContent = ({ children, onClick, showPlusIcon }) => (
  <div>
    {onClick ? (
      <button
        type="button"
        className="pl-0 text-left btn btn-link"
        onClick={onClick}
        onKeyDown={(e) => { if (e.key === 'Enter') { onClick(); } }}
        tabIndex={0}
      >
        {showPlusIcon ? <FontAwesomeIcon size="xs" className="mr-2" icon={faPlus} /> : null}
        {children}
      </button>
    ) : children}
  </div>
);

export default EmptyContent;

EmptyContent.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node,
  showPlusIcon: PropTypes.bool,
};

EmptyContent.defaultProps = {
  onClick: null,
  children: null,
  showPlusIcon: true,
};
