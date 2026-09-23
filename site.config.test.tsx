import type { SiteConfig } from '@openedx/frontend-base';

import { appId } from './src/constants';

const siteConfig: SiteConfig = {
  siteId: 'profile-test-site',
  siteName: 'localhost',
  baseUrl: 'http://localhost:1995',
  lmsBaseUrl: 'http://localhost:18000',
  loginUrl: 'http://localhost:18000/login',
  logoutUrl: 'http://localhost:18000/logout',

  // Use 'test' instead of EnvironmentTypes.TEST to break a circular dependency
  // when mocking `@openedx/frontend-base` itself.
  environment: 'test' as SiteConfig['environment'],
  // The operator layer for tests.  Only the values a test relies on and does not set
  // itself belong here; everything else is absent, as it is on a stock site.
  apps: [{
    appId,
    config: {
      CREDENTIALS_BASE_URL: 'http://localhost:18150',
    },
  }],

  accessTokenCookieName: 'edx-jwt-cookie-header-payload',
};

export default siteConfig;
