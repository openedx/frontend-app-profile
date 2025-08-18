import React from 'react';
import PropTypes from 'prop-types';
import { TransitionReplace } from '@openedx/paragon';

const onChildExit = (htmlNode) => {
  if (htmlNode.contains(document.activeElement)) {
    const enteringChild = htmlNode.previousSibling || htmlNode.nextSibling;

    if (!enteringChild) {
      return;
    }

    const focusableElements = enteringChild.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusableElements.length) {
      focusableElements[0].focus();
    }
  }
};

const SwitchContent = ({ expression = null, cases, className = null }) => {
  const getContent = (caseKey) => {
    if (cases[caseKey]) {
      if (typeof cases[caseKey] === 'string') {
        return getContent(cases[caseKey]);
      }
      return React.cloneElement(cases[caseKey], { key: caseKey });
    }
    if (cases.default) {
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
      onChildExit={onChildExit}
    >
      {getContent(expression)}
    </TransitionReplace>
  );
};

SwitchContent.propTypes = {
  expression: PropTypes.string,
  cases: PropTypes.objectOf(PropTypes.node).isRequired,
  className: PropTypes.string,
};

export default SwitchContent;
