import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';

import EditControls from './elements/EditControls';
import EditableItemHeader from './elements/EditableItemHeader';
import EmptyContent from './elements/EmptyContent';
import SwitchContent from './elements/SwitchContent';


function FullName({
  fullName,
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
            <EditableItemHeader content="Full Name" />
            <Input
              type="text"
              name="fullName"
              defaultValue={fullName}
              onChange={e => onChange('fullName', e.target.value)}
            />
            <EditControls
              onCancel={() => onCancel('fullName')}
              onSave={() => onSave('fullName')}
              saveState={saveState}
              visibility="Everyone"
              onVisibilityChange={e => onVisibilityChange('fullName', e.target.value)}
            />
          </React.Fragment>
        ),
        editable: (
          <React.Fragment>
            <EditableItemHeader
              content="Full Name"
              showEditButton
              onClickEdit={() => onEdit('fullName')}
              showVisibility={Boolean(fullName)}
              visibility="Everyone"
            />
            <h5>{fullName}</h5>
          </React.Fragment>
        ),
        empty: (
          <EmptyContent onClick={() => onEdit('fullName')}>Add name</EmptyContent>
        ),
        static: (
          <React.Fragment>
            <EditableItemHeader content="Full Name" />
            <h5>{fullName}</h5>
          </React.Fragment>
        ),
      }}
    />
  );
}


FullName.propTypes = {
  editMode: PropTypes.string,
  onEdit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onVisibilityChange: PropTypes.func.isRequired,
  saveState: PropTypes.string,
  fullName: PropTypes.string,
};

FullName.defaultProps = {
  editMode: 'static',
  saveState: null,
  fullName: null,
};


export default FullName;
