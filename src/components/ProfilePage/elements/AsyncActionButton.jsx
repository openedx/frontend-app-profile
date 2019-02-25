import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Icon } from '@edx/paragon';
import { Button, Spinner } from 'reactstrap';

function AsyncActionButton({
  onClick,
  className,
  color,
  style,
  variant,
  labels,
  type,
}) {
  const renderIcon = () => {
    if (variant === 'error') return <Icon className="icon fa fa-times-circle" />;
    if (variant === 'complete') return <Icon className="icon fa fa-check-circle" />;
    if (variant === 'pending') return <Spinner size="sm" color="white" />;

    return null;
  };

  const renderLabel = () => {
    if (variant) {
      return labels[variant];
    }

    return labels.default;
  };

  return (
    <Button
      type={type}
      aria-live="assertive"
      onClick={onClick}
      disabled={variant === 'pending' || variant === 'complete' || variant === 'error'}
      className={classNames(
        'btn-async-action',
        'd-inline-flex align-items-center justify-content-center',
        className,
        {
          'btn-state-pending': variant === 'pending',
          'btn-state-complete': variant === 'complete',
          'btn-state-error': variant === 'error',
        },
      )}
      color={color}
      style={style}
    >
      <span aria-hidden className="icon-state d-inline-flex justify-content-start">
        {renderIcon()}
      </span>
      {renderLabel()}
    </Button>
  );
}


export default AsyncActionButton;


AsyncActionButton.propTypes = {
  type: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  color: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object, // eslint-disable-line
  variant: PropTypes.oneOf(['default', 'pending', 'complete', 'error']),
  labels: PropTypes.shape({
    default: PropTypes.string,
    pending: PropTypes.string,
    complete: PropTypes.string,
    error: PropTypes.string,
  }),
};

AsyncActionButton.defaultProps = {
  type: 'button',
  className: null,
  color: 'primary',
  style: null,
  variant: 'default',
  labels: {
    default: 'Save',
    pending: 'Saving',
    complete: 'Saved',
    error: 'Save Failed',
  },
};
