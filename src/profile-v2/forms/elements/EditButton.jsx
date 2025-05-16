import React from 'react';
import PropTypes from 'prop-types';
import { EditOutline } from '@openedx/paragon/icons';
import { injectIntl } from '@edx/frontend-platform/i18n';
import { Button } from '@openedx/paragon';

const EditButton = ({
  onClick, className, style,
}) => (
  <Button
    variant="link"
    size="sm"
    className={className}
    onClick={onClick}
    style={style}
  >
    <EditOutline className="text-gray-700" />
  </Button>
);

export default injectIntl(EditButton);

EditButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  style: PropTypes.object, // eslint-disable-line
};

EditButton.defaultProps = {
  className: null,
  style: null,
};
