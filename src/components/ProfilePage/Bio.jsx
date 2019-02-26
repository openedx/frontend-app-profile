import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Form, FormGroup, Input, Label, FormFeedback } from 'reactstrap';

import EditableItemHeader from './elements/EditableItemHeader';
import EmptyContent from './elements/EmptyContent';
import SwitchContent from './elements/SwitchContent';
import FormControls from './elements/FormControls';


function Bio({
  bio,
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
    onSubmit('bio');
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ name, value });
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
              <Input
                name="bio"
                type="textarea"
                defaultValue={bio}
                invalid={error != null}
              />
              <FormFeedback>{error}</FormFeedback>
            </FormGroup>
            <FormControls
              saveState={saveState}
              onCancel={() => onCancel('bio')}
              visibility={visibility}
              visibilityName="visibility.bio"
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
  error: PropTypes.string,
};

Bio.defaultProps = {
  editMode: 'static',
  saveState: null,
  bio: null,
  visibility: 'private',
  error: null,
};


export default Bio;
