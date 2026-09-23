import { EnvironmentTypes, SiteConfig, footerApp, headerApp, shellApp } from '@openedx/frontend-base';

import { profileApp } from './src';

import '@openedx/frontend-base/shell/style';

const siteConfig: SiteConfig = {
  siteId: 'profile-dev',
  siteName: 'Profile Dev',
  baseUrl: 'http://apps.local.openedx.io:1995',
  lmsBaseUrl: 'http://local.openedx.io:8000',
  loginUrl: 'http://local.openedx.io:8000/login',
  logoutUrl: 'http://local.openedx.io:8000/logout',

  environment: EnvironmentTypes.DEVELOPMENT,
  apps: [
    shellApp,
    headerApp,
    footerApp,
    {
      ...profileApp,
      config: {
        CREDENTIALS_BASE_URL: 'http://local.openedx.io:18150',
      },
    },
  ],
  externalRoutes: [
    {
      role: 'org.openedx.frontend.role.dashboard',
      url: 'http://apps.local.openedx.io:1996/learner-dashboard/',
    },
    {
      role: 'org.openedx.frontend.role.account',
      url: 'http://apps.local.openedx.io:1997/account/',
    },
    {
      role: 'org.openedx.frontend.role.logout',
      url: 'http://local.openedx.io:8000/logout',
    },
  ],

  accessTokenCookieName: 'edx-jwt-cookie-header-payload',
};

export default siteConfig;
