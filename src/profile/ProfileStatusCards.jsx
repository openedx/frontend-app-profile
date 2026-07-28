import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useIntl } from '@edx/frontend-platform/i18n';

import { ReactComponent as BookIcon } from './assets/Book.svg';
import { ReactComponent as CheckIcon } from './assets/Check.svg';
import { ReactComponent as ClockIcon } from './assets/Clock.svg';
import { ReactComponent as TrendingUpIcon } from './assets/TrendingUp.svg';
import StatusCard from './StatusCard';
import messages from './ProfileStatusCards.messages';
import { useIsOnMobileScreen } from './data/hooks';

const PLACEHOLDER = '—';

const ProfileStatusCards = ({ counts, isLoading }) => {
  const intl = useIntl();
  const isMobileView = useIsOnMobileScreen();

  const formatCount = (count) => (isLoading ? PLACEHOLDER : count);

  const cards = [
    {
      key: 'completed',
      variant: 'completed',
      icon: <CheckIcon />,
      value: formatCount(counts.completed),
      label: intl.formatMessage(messages.completed),
    },
    {
      key: 'inProgress',
      variant: 'in-progress',
      icon: <TrendingUpIcon />,
      value: formatCount(counts.inProgress),
      label: intl.formatMessage(messages.inProgress),
    },
    {
      key: 'assigned',
      variant: 'assigned',
      icon: <BookIcon />,
      value: formatCount(counts.assigned),
      label: intl.formatMessage(messages.assigned),
    },
    {
      key: 'totalHours',
      variant: 'total-hours',
      icon: <ClockIcon />,
      value: PLACEHOLDER,
      label: intl.formatMessage(messages.totalHours),
    },
  ];

  return (
    <div
      className={classNames(
        'profile-status-cards',
        { 'profile-status-cards--mobile': isMobileView },
      )}
      aria-busy={isLoading}
    >
      {cards.map(({
        key,
        variant,
        icon,
        value,
        label,
      }) => (
        <StatusCard
          key={key}
          variant={variant}
          icon={icon}
          value={value}
          label={label}
        />
      ))}
    </div>
  );
};

ProfileStatusCards.propTypes = {
  counts: PropTypes.shape({
    completed: PropTypes.number,
    inProgress: PropTypes.number,
    assigned: PropTypes.number,
  }).isRequired,
  isLoading: PropTypes.bool,
};

ProfileStatusCards.defaultProps = {
  isLoading: false,
};

export default ProfileStatusCards;
