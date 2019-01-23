import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';

import EditableContent from './EditableContent';
import EditButton from './EditButton';
import EditControls from './EditControls';


function UserLocation(props) {
  const {
    tag,
    userLocation,
    editMode,
    onEdit,
    onCancel,
    onSave,
  } = props;

  return (
    <EditableContent
      tag={tag}
      isEditing={editMode}
      disabled={false}
      renderStatic={() => (
        <React.Fragment>
          {userLocation}
        </React.Fragment>
      )}
      renderEditable={() => (
        <React.Fragment>
          {userLocation} <EditButton onClick={() => onEdit('userLocation')} />
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
  tag: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  userLocation: PropTypes.string,
  editMode: PropTypes.bool,
  onEdit: PropTypes.func,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
};

UserLocation.defaultProps = {
  tag: 'li',
  userLocation: '',
  editMode: false,
  onEdit: () => {},
  onCancel: () => {},
  onSave: () => {},
};
