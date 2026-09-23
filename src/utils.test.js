import { mergeSiteConfig, setSiteConfig } from '@openedx/frontend-base';
import siteConfig from 'site.config';

import { accountRole } from '@src/constants';
import { getAccountSettingsRoute, parseEnvBoolean } from '@src/utils';

describe('parseEnvBoolean', () => {
  it('accepts the strings the environment variable used', () => {
    expect(parseEnvBoolean('true')).toBe(true);
    expect(parseEnvBoolean('True')).toBe(true);
    expect(parseEnvBoolean('false')).toBe(false);
    expect(parseEnvBoolean('')).toBe(false);
  });

  it('accepts booleans and unset values', () => {
    expect(parseEnvBoolean(true)).toBe(true);
    expect(parseEnvBoolean(false)).toBe(false);
    expect(parseEnvBoolean(undefined)).toBe(false);
    expect(parseEnvBoolean(null)).toBe(false);
  });
});

describe('getAccountSettingsRoute', () => {
  afterEach(() => setSiteConfig(siteConfig));

  it('falls back to the LMS when no route provides the account role', () => {
    expect(getAccountSettingsRoute()).toEqual({
      url: 'http://localhost:18000/account/settings',
      isInternal: false,
    });
  });

  it('uses the external route the site provides for the account role', () => {
    mergeSiteConfig({
      externalRoutes: [{ role: accountRole, url: 'http://account.example.com/account/' }],
    });

    expect(getAccountSettingsRoute()).toEqual({
      url: 'http://account.example.com/account/',
      isInternal: false,
    });
  });

  it('resolves to a path in this site when the account app is installed alongside', () => {
    mergeSiteConfig({
      apps: [{
        appId: 'org.openedx.frontend.app.accountTest',
        routes: [{ path: 'account', handle: { roles: [accountRole] } }],
      }],
    });

    expect(getAccountSettingsRoute()).toEqual({ url: '/account', isInternal: true });
  });
});
