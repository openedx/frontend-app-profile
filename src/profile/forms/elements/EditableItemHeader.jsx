import React from 'react';
import PropTypes from 'prop-types';

import EditButton from './EditButton';
import { Visibility } from './Visibility';

const EditableItemHeader = ({
  content,
  showVisibility,
  visibility,
  showEditButton,
  onClickEdit,
  headingId,
}) => (
  <div className="editable-item-header mb-2">
    <h2 className="edit-section-header" id={headingId}>
      {content}
      {showEditButton ? <EditButton style={{ marginTop: '-.35rem' }} className="float-right px-0" onClick={onClickEdit} /> : null}
    </h2>
    {showVisibility ? <p className="mb-0"><Visibility to={visibility} /></p> : null}
  </div>
);

export default EditableItemHeader;

EditableItemHeader.propTypes = {
  onClickEdit: PropTypes.func,
  showVisibility: PropTypes.bool,
  showEditButton: PropTypes.bool,
  content: PropTypes.node,
  visibility: PropTypes.oneOf(['private', 'all_users']),
  headingId: PropTypes.string,
};

EditableItemHeader.defaultProps = {
  onClickEdit: () => {},
  showVisibility: false,
  showEditButton: false,
  content: '',
  visibility: 'private',
  headingId: null,
};
