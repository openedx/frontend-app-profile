import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// eslint-disable-next-line no-unused-vars
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Button } from '@edx/paragon';

import messages from './EditButton.messages';

const EditButton = ({
  onClick, className, style, intl,
}) => (
  <Button
    variant="link"
    size="sm"
    className={className}
    onClick={onClick}
    style={style}
  >
    <FontAwesomeIcon className="mr-1" />
    {intl.formatMessage(messages['profile.editbutton.edit'])}
  </Button>
);

export default injectIntl(EditButton);

EditButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  style: PropTypes.object, // eslint-disable-line

  // i18n
  intl: intlShape.isRequired,
};

EditButton.defaultProps = {
  className: null,
  style: null,
};
