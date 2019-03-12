import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

function EmptyContent({ children, onClick, showPlusIcon }) {
  const onKeyDown = (e) => { if (e.key === 'Enter') onClick(); };

  const interactiveProps = {
    onClick,
    onKeyDown,
    role: 'button',
    tabIndex: 0,
  };

  return (
    <div>
      {onClick ? (
        <a
          role="button"
          className="pl-0 text-left d-block"
          {...interactiveProps}
        >
          {showPlusIcon ? <FontAwesomeIcon size="xs" className="mr-2" icon={faPlus} /> : null}
          {children}
        </a>
      ) : children}
    </div>
  );
}


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
