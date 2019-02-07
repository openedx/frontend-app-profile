import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';

import EditableContent from './EditableContent';
import EditButton from './EditButton';


function UserLocation({
  userLocation,
  visibility,
  ...editableContentProps
}) {
  return (
    <EditableContent
      {...editableContentProps}
      values={{
        userLocation,
        visibility,
      }}
      renderStatic={() => (
        <React.Fragment>
          {userLocation}
        </React.Fragment>
      )}
      renderEditable={onClickEdit => (
        <React.Fragment>
          {userLocation} <EditButton onClick={onClickEdit} />
        </React.Fragment>
      )}
      renderEditing={(state, setState) => ( // eslint-disable-line no-unused-vars
        <React.Fragment>
          <Input defaultValue={userLocation} type="text" name="text" id="exampleText" />
        </React.Fragment>
      )}
    />
  );
}

export default UserLocation;


UserLocation.propTypes = {
  tag: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  userLocation: PropTypes.string,
  visibility: PropTypes.oneOf(['Everyone', 'Just me']),
};

UserLocation.defaultProps = {
  tag: 'li',
  userLocation: null,
  visibility: 'Everyone',
};
