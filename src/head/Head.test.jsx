import React from 'react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { render } from '@testing-library/react';
import { getConfig } from '@edx/frontend-platform';
import Head from './Head';

describe('Head', () => {
  const props = {};
  it('should match render title tag and favicon with the site configuration values', () => {
    render(<IntlProvider locale="en"><Head {...props} /></IntlProvider>);
    expect(document.title).toEqual(`Profile | ${getConfig().SITE_NAME}`);
    expect(document.querySelector('link[rel="shortcut icon"]').href).toEqual(getConfig().FAVICON_URL);
  });
});
