import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';

import EditableContent from './EditableContent';
import EditButton from './EditButton';
import Visibility from './Visibility';

const valueMap = {
  p: 'Doctorate',
  m: 'Master’s or professional degree',
  b: 'Bachelor’s degree',
  a: 'Associate degree',
  hs: 'Secondary/high school',
  jhs: 'Junior secondary/junior high/middle school',
  el: 'Elementary/primary school',
  none: 'No formal education',
  other: 'Other education',
};

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
          <p>{education.name}</p>
        </React.Fragment>
      )}
      renderEditable={onClickEdit => (
        <React.Fragment>
          <h3>Education <EditButton onClick={onClickEdit} /> <br /><Visibility to="Everyone" /></h3>
          <p>{education.name}</p>
        </React.Fragment>
      )}
      renderEditing={(state, setState) => (
        <React.Fragment>
          <h3>Education</h3>
          <Input
            value={state.education.value}
            onChange={e => setState({
              education: {
                value: e.target.value,
                name: valueMap[e.target.value],
              },
            })}
            className="w-100"
            type="select"
            name="select"
          >
            {Object.keys(valueMap).map(educationKey => (
              <option value={educationKey}>{valueMap[educationKey]}</option>
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
