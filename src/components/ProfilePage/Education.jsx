import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';

import FormControls from './elements/FormControls';
import EditableItemHeader from './elements/EditableItemHeader';
import EmptyContent from './elements/EmptyContent';
import SwitchContent from './elements/SwitchContent';

import EDUCATION from '../../constants/education';


function Education({
  education,
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
            <EditableItemHeader content="Education" />
            <Input
              type="select"
              name="education"
              className="w-100"
              defaultValue={education}
              onChange={e => onChange('education', e.target.value)}
            >
              {Object.keys(EDUCATION).map(key => (
                <option key={key} value={key}>{EDUCATION[key]}</option>
              ))}
            </Input>
            <FormControls
              onCancel={() => onCancel('education')}
              onSave={() => onSave('education')}
              saveState={saveState}
              visibility={visibility}
              onVisibilityChange={e => onVisibilityChange('education', e.target.value)}
            />
          </React.Fragment>
        ),
        editable: (
          <React.Fragment>
            <EditableItemHeader
              content="Education"
              showEditButton
              onClickEdit={() => onEdit('education')}
              showVisibility={Boolean(education)}
              visibility={visibility}
            />
            <h5>{EDUCATION[education]}</h5>
          </React.Fragment>
        ),
        empty: (
          <EmptyContent onClick={() => onEdit('education')}>Add education</EmptyContent>
        ),
        static: (
          <React.Fragment>
            <EditableItemHeader content="Education" />
            <h5>{EDUCATION[education]}</h5>
          </React.Fragment>
        ),
      }}
    />
  );
}

Education.propTypes = {
  editMode: PropTypes.string,
  onEdit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onVisibilityChange: PropTypes.func.isRequired,
  saveState: PropTypes.string,
  education: PropTypes.string,
  visibility: PropTypes.oneOf(['private', 'all_users']),
};

Education.defaultProps = {
  editMode: 'static',
  saveState: null,
  education: null,
  visibility: 'private',
};


export default Education;
