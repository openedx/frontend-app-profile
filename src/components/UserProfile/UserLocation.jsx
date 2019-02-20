import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';

import EditControls from './elements/EditControls';
import EditableItemHeader from './elements/EditableItemHeader';
import EmptyContent from './elements/EmptyContent';
import SwitchContent from './elements/SwitchContent';

import { ALL_COUNTRIES } from '../../constants/countries';


function UserLocation({
  userLocation,
  visibility,
  editMode,
  onEdit,
  onChange,
  onSave,
  onCancel,
  onVisibilityChange,
  saveState,
}) {
  return (
    <SwitchContent
      className="mb-4"
      expression={editMode}
      cases={{
        editing: (
          <React.Fragment>
            <EditableItemHeader content="Location" />
            <Input
              type="select"
              name="userLocation"
              className="w-100"
              defaultValue={userLocation}
              onChange={e => onChange('userLocation', e.target.value)}
            >
              {Object.keys(ALL_COUNTRIES).map(key => (
                <option key={key} value={key}>{ALL_COUNTRIES[key]}</option>
              ))}
            </Input>
            <EditControls
              onCancel={() => onCancel('userLocation')}
              onSave={() => onSave('userLocation')}
              saveState={saveState}
              visibility={visibility}
              onVisibilityChange={e => onVisibilityChange('userLocation', e.target.value)}
            />
          </React.Fragment>
        ),
        editable: (
          <React.Fragment>
            <EditableItemHeader
              content="Location"
              showEditButton
              onClickEdit={() => onEdit('userLocation')}
              showVisibility={Boolean(userLocation)}
              visibility={visibility}
            />
            <h5>{ALL_COUNTRIES[userLocation]}</h5>
          </React.Fragment>
        ),
        empty: (
          <EmptyContent onClick={() => onEdit('userLocation')}>Add location</EmptyContent>
        ),
        static: (
          <React.Fragment>
            <EditableItemHeader content="Location" />
            <h5>{ALL_COUNTRIES[userLocation]}</h5>
          </React.Fragment>
        ),
      }}
    />
  );
}

UserLocation.propTypes = {
  editMode: PropTypes.string,
  onEdit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onVisibilityChange: PropTypes.func.isRequired,
  saveState: PropTypes.string,
  userLocation: PropTypes.string,
  visibility: PropTypes.oneOf(['private', 'all_users']),
};

UserLocation.defaultProps = {
  editMode: 'static',
  saveState: null,
  userLocation: null,
  visibility: 'private',
};


export default UserLocation;
