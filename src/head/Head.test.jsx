import React from 'react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { Helmet } from 'react-helmet';
import { render } from '@testing-library/react';
import { getConfig } from '@edx/frontend-platform';
import Head, { getBrandFaviconUrl } from './Head';

describe('Head', () => {
  const props = {};
  it('should match render title tag and favicon with the indigo brand icon', () => {
    render(<IntlProvider locale="en"><Head {...props} /></IntlProvider>);
    const helmet = Helmet.peek();
    expect(helmet.title).toEqual(`Profile | ${getConfig().SITE_NAME}`);
    expect(helmet.linkTags[0].rel).toEqual('shortcut icon');
    expect(helmet.linkTags[0].href).toEqual(getBrandFaviconUrl());
    expect(helmet.linkTags[0].href).toEqual(
      `${getConfig().LMS_BASE_URL}/static/indigo/images/favicon.ico`,
    );
  });
});
