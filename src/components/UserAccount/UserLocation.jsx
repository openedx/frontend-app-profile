import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';

import EditableContent from './EditableContent';
import EditButton from './EditButton';
import EditControls from './EditControls';


function UserLocation(props) {
  const {
    userLocation,
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
          <li>{userLocation}</li>
        </React.Fragment>
      )}
      renderEditable={() => (
        <React.Fragment>
          <li>{userLocation} <EditButton onClick={() => onEdit('userLocation')} /></li>
        </React.Fragment>
      )}
      renderEditing={() => (
        <React.Fragment>
          <Input defaultValue={userLocation} type="text" name="text" id="exampleText" />
          <EditControls onCancel={onCancel} onSave={onSave} />
        </React.Fragment>
      )}
    />
  );
}

export default UserLocation;


UserLocation.propTypes = {
  userLocation: PropTypes.string,
  editMode: PropTypes.bool,
  onEdit: PropTypes.func,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
};

UserLocation.defaultProps = {
  userLocation: '',
  editMode: false,
  onEdit: () => {},
  onCancel: () => {},
  onSave: () => {},
};
