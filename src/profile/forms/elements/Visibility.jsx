import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import { getConfig } from '@edx/frontend-platform';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash, faEye } from '@fortawesome/free-regular-svg-icons';

import messages from './Visibility.messages';

const Visibility = ({ to }) => {
  const intl = useIntl();
  const icon = to === 'private' ? faEyeSlash : faEye;
  const label = to === 'private'
    ? intl.formatMessage(messages['profile.visibility.who.just.me'])
    : intl.formatMessage(messages['profile.visibility.who.everyone'], {
      siteName: getConfig().SITE_NAME,
    });

  return (
    <span className="ml-auto small text-muted">
      <FontAwesomeIcon icon={icon} /> {label}
    </span>
  );
};

Visibility.propTypes = {
  to: PropTypes.oneOf(['private', 'all_users']),
};
Visibility.defaultProps = {
  to: 'private',
};

const VisibilitySelect = ({ className, ...props }) => {
  const intl = useIntl();
  const { value } = props;
  const icon = value === 'private' ? faEyeSlash : faEye;

  return (
    <span className={className}>
      <span className="d-inline-block ml-1 mr-2 width-24px">
        <FontAwesomeIcon icon={icon} />
      </span>
      <select className="d-inline-block form-control" {...props}>
        <option key="private" value="private">
          {intl.formatMessage(messages['profile.visibility.who.just.me'])}
        </option>
        <option key="all_users" value="all_users">
          {intl.formatMessage(messages['profile.visibility.who.everyone'], {
            siteName: getConfig().SITE_NAME,
          })}
        </option>
      </select>
    </span>
  );
};

VisibilitySelect.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.oneOf(['private', 'all_users']),
  onChange: PropTypes.func,
};
VisibilitySelect.defaultProps = {
  id: null,
  className: null,
  name: 'visibility',
  value: null,
  onChange: null,
};

export { Visibility, VisibilitySelect };
