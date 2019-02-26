import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Input } from 'reactstrap';

import FormControls from './elements/FormControls';
import EditableItemHeader from './elements/EditableItemHeader';
import EmptyContent from './elements/EmptyContent';
import SwitchContent from './elements/SwitchContent';


function Bio({
  bio,
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
            <EditableItemHeader content="About Me" />
            <Input
              type="textarea"
              name="bio"
              defaultValue={bio}
              onChange={e => onChange('bio', e.target.value)}
            />
            <FormControls
              onCancel={() => onCancel('bio')}
              onSave={() => onSave('bio')}
              saveState={saveState}
              visibility={visibility}
              onVisibilityChange={e => onVisibilityChange('bio', e.target.value)}
            />
          </React.Fragment>
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
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onVisibilityChange: PropTypes.func.isRequired,
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
