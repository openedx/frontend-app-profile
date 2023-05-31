import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import edXLogo from '../images/edX-logo.svg';
import messages from './messages';

const SkillsBuilderHeader = ({ isMedium }) => {
  const { formatMessage } = useIntl();

  if (isMedium) {
    return (
      <div className="d-flex">
        <h3 className="mb-0 text-white">
          {formatMessage(messages.skillsBuilderHeaderTitleIsMedium)}
        </h3>
      </div>
    );
  }
  return (
    <div className="d-flex">
      <img src={edXLogo} alt="edx-logo" className="mt-2 h-50" />
      <div className="ml-5 vertical-line" />
      <div className="w-100 ml-5">
        <h1 className="text-warning-300">
          {formatMessage(messages.skillsBuilderHeaderTitle)}
        </h1>
        <h2 className="text-white">
          {formatMessage(messages.skillsBuilderHeaderSubheading)}
        </h2>
      </div>
    </div>
  );
};

SkillsBuilderHeader.propTypes = {
  isMedium: PropTypes.func.isRequired,
};

export default SkillsBuilderHeader;
