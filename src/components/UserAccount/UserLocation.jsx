import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';

import { ALL_COUNTRIES } from '../../constants/countries';
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
          <Input
            value={state.userLocation}
            onChange={(e) => {
              setState({
                userLocation: e.target.value,
              });
            }}
            className="w-100"
            type="select"
            name="select"
          >
            {Object.keys(ALL_COUNTRIES).map(countryKey => (
              <option value={countryKey}>{ALL_COUNTRIES[countryKey]}</option>
            ))}
          </Input>
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
