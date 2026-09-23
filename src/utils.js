import { getSiteConfig, resolveRouteByRole } from '@openedx/frontend-base';

import { accountRole } from '@src/constants';

/**
 * Parse a configuration value that stands for a boolean, whether it arrived as a boolean or as
 * one of the strings the environment variable it replaces used.
 * @param {string|boolean} value the configuration value
 * @returns {boolean} the parsed boolean value
 */
export const parseEnvBoolean = (value) => {
  if (!value) {
    return false;
  }
  return String(value).toLowerCase() === 'true';
};

/**
 * The account settings page to link to: the route the site provides for the account role, or the
 * LMS's own page when it provides none. `isInternal` says whether the site's router can navigate
 * to it, so callers do not have to work that out from the URL a second time.
 * @returns {{ url: string, isInternal: boolean }}
 */
export const getAccountSettingsRoute = () => (
  resolveRouteByRole(accountRole)
  ?? { url: `${getSiteConfig().lmsBaseUrl}/account/settings`, isInternal: false }
);
