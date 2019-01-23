import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';

import EditableContent from './EditableContent';
import EditButton from './EditButton';
import EditControls from './EditControls';
import Visibility from './Visibility';


function Education(props) {
  const {
    education,
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
          <h3>Education</h3>
          <p>{education.name}</p>
        </React.Fragment>
      )}
      renderEditable={() => (
        <React.Fragment>
          <h3>Education <EditButton onClick={() => onEdit('education')} /> <br /><Visibility to="Everyone" /></h3>
          <p>{education.name}</p>
        </React.Fragment>
      )}
      renderEditing={() => (
        <React.Fragment>
          <h3>Education</h3>
          <Input defaultValue={education.value} className="w-100" type="select" name="select" id="exampleSelect">
            <option value="p">Doctorate</option>
            <option value="m">Master’s or professional degree</option>
            <option value="b">Bachelor’s degree</option>
            <option value="a">Associate degree</option>
            <option value="hs">Secondary/high school</option>
            <option value="jhs">Junior secondary/junior high/middle school</option>
            <option value="el">Elementary/primary school</option>
            <option value="none">No formal education</option>
            <option value="other">Other education</option>
          </Input>
          <EditControls onCancel={onCancel} onSave={onSave} />
        </React.Fragment>
      )}
    />
  );
}

export default Education;

Education.propTypes = {
  education: PropTypes.string,
  editMode: PropTypes.bool,
  onEdit: PropTypes.func,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
};

Education.defaultProps = {
  education: null,
  editMode: false,
  onEdit: () => {},
  onCancel: () => {},
  onSave: () => {},
};
