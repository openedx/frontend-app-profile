import { mergeSiteConfig, setSiteConfig } from '@openedx/frontend-base';
import siteConfig from 'site.config';

import { accountRole } from '@src/constants';
import { getAccountSettingsUrl, parseEnvBoolean } from '@src/utils';

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

describe('getAccountSettingsUrl', () => {
  afterEach(() => setSiteConfig(siteConfig));

  it('falls back to the LMS when no route provides the account role', () => {
    expect(getAccountSettingsUrl()).toBe('http://localhost:18000/account/settings');
  });

  it('uses the external route the site provides for the account role', () => {
    mergeSiteConfig({
      externalRoutes: [{ role: accountRole, url: 'http://account.example.com/account/' }],
    });

    expect(getAccountSettingsUrl()).toBe('http://account.example.com/account/');
  });

  it('resolves to a path in this site when the account app is installed alongside', () => {
    mergeSiteConfig({
      apps: [{
        appId: 'org.openedx.frontend.app.accountTest',
        routes: [{ path: 'account', handle: { roles: [accountRole] } }],
      }],
    });

    expect(getAccountSettingsUrl()).toBe('/account');
  });
});
