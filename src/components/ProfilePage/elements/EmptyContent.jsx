import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
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
        <Button
          type="button"
          color="link"
          block
          className="pl-0 text-left"
          {...interactiveProps}
        >
          {showPlusIcon ? <FontAwesomeIcon size="xs" className="mr-2" icon={faPlus} /> : null}
          {children}
        </Button>
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
