import React from 'react';
import PropTypes from 'prop-types';

import EditButton from './EditButton';
import Visibility from './Visibility';


function EditableItemHeader({
  content,
  showVisibility,
  visibility,
  showEditButton,
  onClickEdit,
}) {
  return (
    <React.Fragment>
      <h6 className="font-weight-normal">
        {content}
        {showEditButton ? <EditButton style={{ marginTop: '-.35rem' }} className="float-right" onClick={onClickEdit} /> : null}
      </h6>
      {showVisibility ? <p className="mb-1"><Visibility to={visibility} /></p> : null}
    </React.Fragment>
  );
}

export default EditableItemHeader;

EditableItemHeader.propTypes = {
  onClickEdit: PropTypes.func,
  showVisibility: PropTypes.bool,
  showEditButton: PropTypes.bool,
  content: PropTypes.string,
  visibility: PropTypes.oneOf(['Everyone', 'Just me']),
};

EditableItemHeader.defaultProps = {
  onClickEdit: () => {},
  showVisibility: false,
  showEditButton: false,
  content: '',
  visibility: 'Everyone',
};
