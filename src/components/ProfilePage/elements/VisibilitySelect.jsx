import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';
import { injectIntl, intlShape } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash, faEye } from '@fortawesome/free-regular-svg-icons';

import messages from './VisibilitySelect.messages';


function VisibilitySelect({ intl, className, ...props }) {
  const { value } = props;

  const icon = value === 'private' ? faEyeSlash : faEye;

  return (
    <span className={className}>
      <span className="d-inline-block mr-2" style={{ width: '1.5rem' }}>
        <FontAwesomeIcon icon={icon} />
      </span>
      <Input className="d-inline-block w-auto" {...props} type="select">
        <option key="private" value="private">
          {intl.formatMessage(messages['profile.formcontrols.who.just.me'])}
        </option>
        <option key="all_users" value="all_users">
          {intl.formatMessage(messages['profile.formcontrols.who.everyone'])}
        </option>
      </Input>
    </span>
  );
}

export default injectIntl(VisibilitySelect);

VisibilitySelect.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.oneOf(['private', 'all_users']),
  onChange: PropTypes.func,

  // i18n
  intl: intlShape.isRequired,
};

VisibilitySelect.defaultProps = {
  id: null,
  className: null,
  name: 'visibility',
  value: null,
  onChange: null,
};
