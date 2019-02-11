import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';

import EditableContent from './EditableContent';
import EditButton from './EditButton';
import Visibility from './Visibility';

import EDUCATION from '../../constants/education';

function Education({ education, visibility, ...editableContentProps }) {
  return (
    <EditableContent
      {...editableContentProps}
      values={{
        education,
        visibility,
      }}
      renderStatic={() => (
        <React.Fragment>
          <h3>Education</h3>
          <p>{EDUCATION[education]}</p>
        </React.Fragment>
      )}
      renderEditable={onClickEdit => (
        <React.Fragment>
          <h3>Education <EditButton onClick={onClickEdit} /></h3>
          <Visibility to="Everyone" />
          <p>{EDUCATION[education]}</p>
        </React.Fragment>
      )}
      renderEditing={(state, setState) => (
        <React.Fragment>
          <h3>Education</h3>
          <Input
            value={state.education}
            onChange={(e) => {
              setState({
                education: e.target.value,
              });
            }}
            className="w-100"
            type="select"
            name="select"
          >
            {Object.keys(EDUCATION).map(educationKey => (
              <option key={educationKey} value={educationKey}>{EDUCATION[educationKey]}</option>
            ))}
          </Input>
        </React.Fragment>
      )}
    />
  );
}

export default Education;

Education.propTypes = {
  education: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.string,
  }),
  visibility: PropTypes.oneOf(['Everyone', 'Just me']),
};

Education.defaultProps = {
  education: null,
  visibility: 'Everyone',
};
