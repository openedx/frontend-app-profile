import React from 'react';
import PropTypes from 'prop-types';

import TransitionReplace from './TransitionReplace';

function EditableContent({ children }) {
  return (
    <TransitionReplace
      className="mb-4"
    >
      {children}
    </TransitionReplace>
  );
}


export default EditableContent;


EditableContent.propTypes = {
  children: PropTypes.element.isRequired,
};
