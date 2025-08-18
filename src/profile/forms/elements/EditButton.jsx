import React from 'react';
import PropTypes from 'prop-types';
import { EditOutline } from '@openedx/paragon/icons';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Button, OverlayTrigger, Tooltip } from '@openedx/paragon';
import messages from './EditButton.messages';

const EditButton = ({ onClick, className = null, style = null }) => {
  const intl = useIntl();
  return (
    <OverlayTrigger
      key="top"
      placement="top"
      overlay={(
        <Tooltip variant="light" id="tooltip-top">
          <p className="h5 font-weight-normal m-0 p-0">
            {intl.formatMessage(messages['profile.editbutton.edit'])}
          </p>
        </Tooltip>
      )}
    >
      <Button
        variant="link"
        size="sm"
        className={className}
        onClick={onClick}
        style={style}
      >
        <EditOutline className="text-gray-700" />
      </Button>
    </OverlayTrigger>
  );
};

export default EditButton;

EditButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  style: PropTypes.object, // eslint-disable-line
};

