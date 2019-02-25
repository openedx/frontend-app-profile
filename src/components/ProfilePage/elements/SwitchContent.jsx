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
  const getContent = (caseKey) => {
    if (cases[caseKey]) {
      if (typeof cases[caseKey] === 'string') {
        return getContent(cases[caseKey]);
      }
      return React.cloneElement(cases[caseKey], { key: caseKey });
    } else if (cases.default) {
      if (typeof cases.default === 'string') {
        return getContent(cases.default);
      }
      React.cloneElement(cases.default, { key: 'default' });
    }

    return null;
  };

  return (
    <TransitionReplace
      className={className}
      onChildEntered={onChildEntered}
      onChildExit={onChildExit}
    >
      {getContent(expression)}
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
