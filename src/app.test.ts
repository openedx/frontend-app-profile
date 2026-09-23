import {
  addAppConfigs, authenticatedLoader, getAppConfig, mergeSiteConfig,
} from '@openedx/frontend-base';
import siteConfig from 'site.config';

import app from '@src/app';
import { appId, profileRole } from '@src/constants';
import routes from '@src/routes';
import slots from '@src/slots';

const defaults = {
  DISABLE_VISIBILITY_EDITING: false,
  CREDENTIALS_BASE_URL: null,
};

describe('profileApp', () => {
  it('declares the profile appId, routes, and slots', () => {
    expect(app.appId).toBe(appId);
    expect(app.routes).toBe(routes);
    expect(app.slots).toBe(slots);
  });

  it('bundles the defaults that have to work out of the box', () => {
    expect(app.defaultConfig).toEqual(defaults);
  });

  it('leaves config to the operator', () => {
    expect(app.config).toBeUndefined();
  });
});

describe('routes', () => {
  const [main] = routes;

  it('mounts the app at profile, behind authentication', () => {
    expect(main.path).toBe('profile');
    expect(main.loader).toBe(authenticatedLoader);
  });

  it('puts the profile role on the parent route, where links append /u/<username>', () => {
    expect(main.handle?.roles).toEqual([profileRole]);
    expect(main.children?.some(route => route.handle?.roles)).toBe(false);
  });

  it('keeps the profile page at u/:username, where the header and the LMS link to it', () => {
    expect(main.children?.map(route => route.path)).toEqual(['u/:username']);
  });

  it('lazy-loads the layout and the page', async () => {
    const [page] = main.children ?? [];

    await expect(main.lazy?.()).resolves.toEqual({ Component: (await import('@src/Main')).default });
    await expect(page?.lazy?.()).resolves.toEqual({
      Component: (await import('@src/profile/ProfilePage')).default,
    });
  });
});

describe('config resolution', () => {
  it('resolves the bundled defaults underneath the operator config', () => {
    mergeSiteConfig({ apps: [app] });
    addAppConfigs();

    const [testApp] = siteConfig.apps ?? [];
    expect(getAppConfig(appId)).toEqual({ ...defaults, ...testApp.config });
  });

  it('lets the operator per-app config beat a bundled default', () => {
    mergeSiteConfig({ apps: [{ ...app, config: { CREDENTIALS_BASE_URL: 'https://records.example.com' } }] });
    addAppConfigs();

    expect(getAppConfig(appId).CREDENTIALS_BASE_URL).toBe('https://records.example.com');
    expect(getAppConfig(appId).DISABLE_VISIBILITY_EDITING).toBe(false);
  });
});
