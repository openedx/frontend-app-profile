import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import {
  IconButton, Icon,
} from '@edx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Close } from '@edx/paragon/icons';
import { SkillsBuilderContext } from '../../skills-builder-context';
import { removeCareerInterest } from '../../data/actions';
import messages from './messages';

const CareerInterestCard = ({ interest }) => {
  const intl = useIntl();
  const { dispatch } = useContext(SkillsBuilderContext);

  return (
    <div className="d-flex justify-content-between align-items-center pb-2 pr-2 pl-4 rounded shadow-sm">
      <p className="pt-4">
        {interest}
      </p>
      <IconButton
        iconAs={Icon}
        src={Close}
        alt={`${intl.formatMessage(messages.removeCareerInterestButtonAltText)} ${interest}`}
        onClick={() => dispatch(removeCareerInterest(interest))}
      />
    </div>
  );
};

CareerInterestCard.propTypes = {
  interest: PropTypes.string.isRequired,
};

export default CareerInterestCard;
