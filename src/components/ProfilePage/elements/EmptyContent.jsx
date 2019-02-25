import React from 'react';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

function EmptyContent({ children, onClick, showPlusIcon }) {
  const onKeyDown = (e) => { if (e.key === 'Enter') onClick(); };

  const commonProps = {
    className: 'd-flex align-items-center p-3 bg-light rounded text-muted w-100',
    style: {
      cursor: onClick ? 'pointer' : null,
    },
  };

  const interactiveProps = {
    onClick,
    onKeyDown,
    role: 'button',
    tabIndex: 0,
  };

  let props;

  if (onClick) {
    props = {
      ...commonProps,
      ...interactiveProps,
    };
  } else {
    props = commonProps;
  }

  return (
    <div {...props}>
      {showPlusIcon ? <FontAwesomeIcon className="ml-1 mr-3" icon={faPlus} /> : null}
      {children}
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
