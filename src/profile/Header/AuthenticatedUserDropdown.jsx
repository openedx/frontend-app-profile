import React from "react";
import PropTypes from "prop-types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";

import { getConfig } from "@edx/frontend-platform";
import { injectIntl, intlShape } from "@edx/frontend-platform/i18n";
import { Dropdown } from "@edx/paragon";

import messages from "./messages";

function AuthenticatedUserDropdown({
  enterpriseLearnerPortalLink,
  intl,
  username,
}) {
  let dashboardMenuItem = (
    <Dropdown.Item href={`${getConfig().LMS_BASE_URL}/dashboard`}>
      {intl.formatMessage(messages.dashboard)}
    </Dropdown.Item>
  );
  if (
    enterpriseLearnerPortalLink &&
    Object.keys(enterpriseLearnerPortalLink).length > 0
  ) {
    dashboardMenuItem = (
      <Dropdown.Item href={enterpriseLearnerPortalLink.href}>
        {enterpriseLearnerPortalLink.content}
      </Dropdown.Item>
    );
  }
  return (
    <>
      <a className="courses-link" href={`${getConfig().LMS_BASE_URL}/courses`}>
        {intl.formatMessage(messages.Explore)}
      </a>
      
      <a className="courses-link" href={`${getConfig().LMS_BASE_URL}/dashboard`}>
        {intl.formatMessage(messages.mycourses)}
      </a>

      <Dropdown className="user-dropdown">
        <Dropdown.Toggle variant="outline-primary">
          <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
            <path
              d="M4.10255106,18.1351061 C4.7170266,16.0581859 8.01891846,14.4720277 12,14.4720277 C15.9810815,14.4720277 19.2829734,16.0581859 19.8974489,18.1351061 C21.215206,16.4412566 22,14.3122775 22,12 C22,6.4771525 17.5228475,2 12,2 C6.4771525,2 2,6.4771525 2,12 C2,14.3122775 2.78479405,16.4412566 4.10255106,18.1351061 Z M12,24 C5.372583,24 0,18.627417 0,12 C0,5.372583 5.372583,0 12,0 C18.627417,0 24,5.372583 24,12 C24,18.627417 18.627417,24 12,24 Z M12,13 C9.790861,13 8,11.209139 8,9 C8,6.790861 9.790861,5 12,5 C14.209139,5 16,6.790861 16,9 C16,11.209139 14.209139,13 12,13 Z"
              fill="currentColor"
            />
          </svg>
          <span data-hj-suppress className="d-none d-md-inline">
            {username}
          </span>
        </Dropdown.Toggle>
        <Dropdown.Menu className="dropdown-menu-right">
          {dashboardMenuItem}
          <Dropdown.Item href={`${getConfig().LMS_BASE_URL}/u/${username}`}>
            {intl.formatMessage(messages.profile)}
          </Dropdown.Item>
          <Dropdown.Item href={`${getConfig().LMS_BASE_URL}/account/settings`}>
            {intl.formatMessage(messages.account)}
          </Dropdown.Item>
          {!enterpriseLearnerPortalLink && (
            // Users should only see Order History if they do not have an available
            // learner portal, because an available learner portal currently means
            // that they access content via Subscriptions, in which context an "order"
            // is not relevant.
            <Dropdown.Item href={getConfig().ORDER_HISTORY_URL}>
              {intl.formatMessage(messages.orderHistory)}
            </Dropdown.Item>
          )}
          <Dropdown.Item href={getConfig().LOGOUT_URL}>
            {intl.formatMessage(messages.signOut)}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
}

AuthenticatedUserDropdown.propTypes = {
  enterpriseLearnerPortalLink: PropTypes.string,
  intl: intlShape.isRequired,
  username: PropTypes.string.isRequired,
};

AuthenticatedUserDropdown.defaultProps = {
  enterpriseLearnerPortalLink: "",
};

export default injectIntl(AuthenticatedUserDropdown);
