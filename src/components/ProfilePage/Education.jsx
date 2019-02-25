import React from 'react';
import PropTypes from 'prop-types';
import { Form, FormGroup, Input, Label, Button } from 'reactstrap';

import EditableItemHeader from './elements/EditableItemHeader';
import EmptyContent from './elements/EmptyContent';
import SwitchContent from './elements/SwitchContent';
import AsyncActionButton from './elements/AsyncActionButton';

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
              >
                {Object.keys(EDUCATION).map(key => (
                  <option key={key} value={key}>{EDUCATION[key]}</option>
                ))}
              </Input>
            </FormGroup>
            <Label for="visibility.education">Who can see this:</Label>
            <Input type="select" name="visibility.education" defaultValue={visibility}>
              <option value="private">Just me</option>
              <option value="all_users">Everyone on edX</option>
            </Input>
            <Button color="link" onClick={handleClickCancel}>Cancel</Button>
            <AsyncActionButton
              type="submit"
              variant={saveState}
              labels={{
                default: 'Save',
                pending: 'Saving',
                complete: 'Saved',
                error: 'Save Failed',
              }}
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
};

Education.defaultProps = {
  editMode: 'static',
  saveState: null,
  education: null,
  visibility: 'private',
};


export default Education;
