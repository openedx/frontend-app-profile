import React from 'react';
import PropTypes from 'prop-types';
import { Form, FormGroup, Input, Label, Button, FormFeedback } from 'reactstrap';

import EditableItemHeader from './elements/EditableItemHeader';
import EmptyContent from './elements/EmptyContent';
import SwitchContent from './elements/SwitchContent';
import FormControls from './elements/FormControls';

import EDUCATION from '../../constants/education';


function Education({
  education,
  visibility,
  editMode,
  onEdit,
  onChange,
  onCancel,
  onSubmit,
  saveState,
  error,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit('education');
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ name, value });
  };
  const handleClickCancel = () => {
    onCancel('education');
  };
  return (
    <SwitchContent
      className="mb-4"
      expression={editMode}
      cases={{
        editing: (
          <Form onSubmit={handleSubmit} onChange={handleChange}>
            <FormGroup>
              <Label for="education">Education</Label>
              <Input
                type="select"
                name="education"
                className="w-100"
                defaultValue={education}
                invalid={error != null}
              >
                {Object.keys(EDUCATION).map(key => (
                  <option key={key} value={key}>{EDUCATION[key]}</option>
                ))}
              </Input>
              <FormFeedback>{error}</FormFeedback>
            </FormGroup>
            <FormControls
              saveState={saveState}
              onCancel={onCancel} 
              visibility={visibility}
              visibilityName="visibility.education"
            />
          </Form>
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
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  saveState: PropTypes.string,
  education: PropTypes.string,
  visibility: PropTypes.oneOf(['private', 'all_users']),
  error: PropTypes.string,
};

Education.defaultProps = {
  editMode: 'static',
  saveState: null,
  education: null,
  visibility: 'private',
  error: null,
};


export default Education;
