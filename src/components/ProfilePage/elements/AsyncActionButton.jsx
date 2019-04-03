import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Icon, Button } from '@edx/paragon';

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
    if (variant === 'pending') {
      return (
        <div className="spinner-border-sm spinner-border text-white" role="status" />
      );
    }

    return null;
  };

  const renderLabel = () => {
    if (variant) {
      return labels[variant];
    }

    return labels.default;
  };

  const isDisabled = variant === 'pending' || variant === 'complete' || variant === 'error';

  return (
    <Button
      type={type}
      aria-live="assertive"
      onClick={onClick}
      disabled={isDisabled}
      className={classNames(
        'btn-async-action',
        'd-inline-flex align-items-center justify-content-center',
        className,
        {
          'btn-state-pending': variant === 'pending',
          'btn-state-complete': variant === 'complete',
          'btn-state-error': variant === 'error',
          [`btn-${color}`]: color != null,
          disabled: isDisabled,
        },
      ).split(' ')}
      style={style}
      label={(
        <React.Fragment>
          <span aria-hidden className="icon-state d-inline-flex justify-content-start">
            {renderIcon()}
          </span>
          {renderLabel()}
        </React.Fragment>
      )}
    />
  );
}


export default AsyncActionButton;


AsyncActionButton.propTypes = {
  type: PropTypes.string,
  onClick: PropTypes.func,
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
  onClick: null,
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
