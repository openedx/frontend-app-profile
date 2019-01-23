import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';

import EditableContent from './EditableContent';
import EditButton from './EditButton';
import Visibility from './Visibility';


function Bio({
  bio,
  visibility,
  title,
  ...editableContentProps
}) {
  return (
    <EditableContent
      {...editableContentProps}
      values={{
        bio,
        visibility,
      }}
      renderStatic={() => (
        <React.Fragment>
          <h3>{title}</h3>
          <p>{bio}</p>
        </React.Fragment>
      )}
      renderEditable={onClickEdit => (
        <React.Fragment>
          <h3>{title} <EditButton onClick={onClickEdit} /> <br /><Visibility to="Everyone" /></h3>
          <p>{bio}</p>
        </React.Fragment>
      )}
      renderEditing={(state, setState) => ( // eslint-disable-line no-unused-vars
        <React.Fragment>
          <h3>{title}</h3>
          <Input
            defaultValue={state.bio}
            type="textarea"
            name="text"
            id="exampleText"
            onChange={(e) => {
              setState({
                bio: e.target.value,
              });
            }}
          />
        </React.Fragment>
      )}
    />
  );
}

export default Bio;

Bio.propTypes = {
  bio: PropTypes.string,
  title: PropTypes.string,
  visibility: PropTypes.oneOf(['Everyone', 'Just me']),
};

Bio.defaultProps = {
  bio: '',
  title: 'About',
  visibility: 'Everyone',
};
