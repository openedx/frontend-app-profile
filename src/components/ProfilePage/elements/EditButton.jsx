import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { injectIntl, intlShape } from 'react-intl';
import { Button } from '@edx/paragon';

import messages from './EditButton.messages';

function EditButton({
  onClick, className, style, intl,
}) {
  return (
    <Button
      className={classNames('btn btn-sm btn-link', className)}
      onClick={onClick}
      style={style}
    >
      <FontAwesomeIcon icon={faPencilAlt} /> {intl.formatMessage(messages['profile.editbutton.edit'])}
    </Button>
  );
}

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
