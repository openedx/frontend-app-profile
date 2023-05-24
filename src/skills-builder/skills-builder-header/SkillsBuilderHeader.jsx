import React from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { breakpoints, useMediaQuery } from '@edx/paragon';
import edXLogo from '../images/edX-logo.svg';
import messages from './messages';

const SkillsBuilderHeader = () => {
  const { formatMessage } = useIntl();
  const isMedium = useMediaQuery({ maxWidth: breakpoints.medium.maxWidth });

  if (isMedium) {
    return (
      <div className="d-flex">
        <h1 className="h1 text-white">
          {formatMessage(messages.skillsBuilderHeaderTitle)}
        </h1>
      </div>
    );
  }
  return (
    <div className="d-flex">
      <img src={edXLogo} alt="edx-logo" className="mt-2 h-50" />
      <div className="ml-5 vertical-line" />
      <div className="w-100 ml-5">
        <h1 className="h1 text-warning-300">
          {formatMessage(messages.skillsBuilderHeaderTitle)}
        </h1>
        <p className="h2 text-white">
          {formatMessage(messages.skillsBuilderHeaderSubheading)}
        </p>
      </div>
    </div>
  );
};

export default SkillsBuilderHeader;
