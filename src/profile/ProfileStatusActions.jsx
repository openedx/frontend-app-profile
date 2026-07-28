import React from 'react';
import PropTypes from 'prop-types';
import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Hyperlink } from '@openedx/paragon';

import { ReactComponent as BookIcon } from './assets/Book.svg';
import { ReactComponent as TrendingUpIcon } from './assets/TrendingUp.svg';
import messages from './ProfileStatusCards.messages';

const ProfileStatusActions = ({ overdueCount, isLoading }) => {
  const intl = useIntl();
  const dashboardUrl = `${getConfig().LMS_BASE_URL}/dashboard`;

  return (
    <>
      <div className="profile-status-divider" role="separator" />

      <div className="profile-status-actions">
        <Hyperlink
          destination={dashboardUrl}
          className="profile-status-action-btn"
          showLaunchIcon={false}
        >
          <TrendingUpIcon className="profile-status-action-btn__icon" aria-hidden="true" />
          <span>{intl.formatMessage(messages.viewAllInProgress)}</span>
        </Hyperlink>

        <Hyperlink
          destination={dashboardUrl}
          className="profile-status-action-btn"
          showLaunchIcon={false}
        >
          <BookIcon className="profile-status-action-btn__icon" aria-hidden="true" />
          <span>{intl.formatMessage(messages.viewAssignedCourses)}</span>
          {!isLoading && overdueCount > 0 && (
            <span className="profile-status-action-btn__badge">
              {intl.formatMessage(messages.overdueBadge, { count: overdueCount })}
            </span>
          )}
        </Hyperlink>
      </div>
    </>
  );
};

ProfileStatusActions.propTypes = {
  overdueCount: PropTypes.number,
  isLoading: PropTypes.bool,
};

ProfileStatusActions.defaultProps = {
  overdueCount: 0,
  isLoading: false,
};

export default ProfileStatusActions;
