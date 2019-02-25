import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Form, FormGroup, Input, Label, Button } from 'reactstrap';

import EditableItemHeader from './elements/EditableItemHeader';
import EmptyContent from './elements/EmptyContent';
import SwitchContent from './elements/SwitchContent';
import AsyncActionButton from './elements/AsyncActionButton';


function Bio({
  bio,
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
    onSubmit('bio');
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ name, value });
  };
  const handleClickCancel = () => {
    onCancel('bio');
  };
  return (
    <SwitchContent
      className="mb-4"
      expression={editMode}
      cases={{
        editing: (
          <Form onSubmit={handleSubmit} onChange={handleChange}>
            <FormGroup>
              <Label for="bio">About Me</Label>
              <Input type="textarea" name="bio" defaultValue={bio} />
            </FormGroup>
            <Label for="visibility.bio">Who can see this:</Label>
            <Input type="select" name="visibility.bio" defaultValue={visibility}>
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
              content="About Me"
              showEditButton
              onClickEdit={() => onEdit('bio')}
              showVisibility={Boolean(bio)}
              visibility={visibility}
            />
            <p className="lead">{bio}</p>
          </React.Fragment>
        ),
        empty: (
          <EmptyContent onClick={() => onEdit('bio')}>
            <FormattedMessage
              id="profile.bio.empty"
              defaultMessage="Add a short bio"
              description="instructions when the user hasn't written an About Me"
            />
          </EmptyContent>
        ),
        static: (
          <React.Fragment>
            <EditableItemHeader content="About Me" />
            <p className="lead">{bio}</p>,
          </React.Fragment>
        ),
      }}
    />
  );
}

Bio.propTypes = {
  editMode: PropTypes.string,
  onEdit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  saveState: PropTypes.string,
  bio: PropTypes.string,
  visibility: PropTypes.oneOf(['private', 'all_users']),
};

Bio.defaultProps = {
  editMode: 'static',
  saveState: null,
  bio: null,
  visibility: 'private',
};


export default Bio;
