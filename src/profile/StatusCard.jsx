import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const StatusCard = ({
  icon,
  value,
  label,
  variant,
}) => (
  <div
    className={classNames('profile-status-card', `profile-status-card--${variant}`)}
    aria-label={`${value} ${label}`}
  >
    <div className="profile-status-card__metric">
      {icon && (
        <span className="profile-status-card__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className="profile-status-card__value">{value}</span>
    </div>
    <span className="profile-status-card__label">{label}</span>
  </div>
);

StatusCard.propTypes = {
  icon: PropTypes.node,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['completed', 'in-progress', 'assigned', 'total-hours']).isRequired,
};

StatusCard.defaultProps = {
  icon: null,
};

export default StatusCard;
