import React from 'react';
import PropTypes from 'prop-types';
import { Form, FormGroup, Input, Label, Button } from 'reactstrap';

import FormControls from './elements/FormControls';
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
  onCancel,
  onSubmit,
  saveState,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit('userLocation');
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ name, value });
  };
  const handleClickCancel = () => {
    onCancel('userLocation');
  };
  return (
    <SwitchContent
      className="mb-4"
      expression={editMode}
      cases={{
        editing: (
          <Form onSubmit={handleSubmit} onChange={handleChange}>
            <FormGroup>
              <Label for="userLocation">Location</Label>
              <Input
                type="select"
                name="userLocation"
                className="w-100"
                defaultValue={userLocation}
              >
                {Object.keys(ALL_COUNTRIES).map(key => (
                  <option key={key} value={key}>{ALL_COUNTRIES[key]}</option>
                ))}
              </Input>
            </FormGroup>
            <FormControls
              saveState={saveState}
              onCancel={onCancel} 
              visibility={visibility}
              visibilityName="visibility.userLocation"
            />
          </Form>
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
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
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
