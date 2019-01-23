import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';

import EditableContent from './EditableContent';
import EditButton from './EditButton';
import EditControls from './EditControls';
import Visibility from './Visibility';


function Bio(props) {
  const {
    bio,
    title,
    editMode,
    onEdit,
    onCancel,
    onSave,
  } = props;

  return (
    <EditableContent
      isEditing={editMode}
      disabled={false}
      renderStatic={() => (
        <React.Fragment>
          <h3>{title}</h3>
          <p>{bio}</p>
        </React.Fragment>
      )}
      renderEditable={() => (
        <React.Fragment>
          <h3>{title} <EditButton onClick={() => onEdit('bio')} /> <br /><Visibility to="Everyone" /></h3>
          <p>{bio}</p>
        </React.Fragment>
      )}
      renderEditing={() => (
        <React.Fragment>
          <h3>{title}</h3>
          <Input defaultValue={bio} type="textarea" name="text" id="exampleText" />
          <EditControls onCancel={onCancel} onSave={onSave} />
        </React.Fragment>
      )}
    />
  );
}

export default Bio;

Bio.propTypes = {
  bio: PropTypes.string,
  title: PropTypes.string,
  editMode: PropTypes.bool,
  onEdit: PropTypes.func,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
};

Bio.defaultProps = {
  bio: '',
  title: 'About',
  editMode: false,
  onEdit: () => {},
  onCancel: () => {},
  onSave: () => {},
};
