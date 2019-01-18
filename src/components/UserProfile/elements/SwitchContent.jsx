import React from 'react';
import PropTypes from 'prop-types';
import TransitionReplace from './TransitionReplace';


const onChildEntered = (htmlNode) => {
  const focusableElements = htmlNode.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (focusableElements.length) {
    focusableElements[0].focus();
  }
};

const onChildExit = (htmlNode) => {
  if (htmlNode.contains(document.activeElement)) {
    document.activeElement.blur();
  }
};


function SwitchContent({ expression, cases, className }) {
  if (!cases[expression] && !cases.default) {
    return null;
  }

  return (
    <TransitionReplace
      className={className}
      onChildEntered={onChildEntered}
      onChildExit={onChildExit}
    >
      {expression ? React.cloneElement(cases[expression], { key: expression }) : React.cloneElement(cases.default, { key: 'default' })}
    </TransitionReplace>
  );
}


SwitchContent.propTypes = {
  expression: PropTypes.string,
  cases: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  className: PropTypes.string,
};

SwitchContent.defaultProps = {
  expression: null,
  className: null,
};


export default SwitchContent;
