import React from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from '@edx/frontend-platform/i18n';
import { getConfig } from '@edx/frontend-platform';

import messages from './messages';

export const getBrandFaviconUrl = () => (
  `${getConfig().LMS_BASE_URL}/static/indigo/images/favicon.ico`
);

const Head = () => {
  const intl = useIntl();
  return (
    <Helmet>
      <title>
        {intl.formatMessage(messages['profile.page.title'], {
          siteName: getConfig().SITE_NAME,
        })}
      </title>
      <link
        rel="shortcut icon"
        href={getBrandFaviconUrl()}
        type="image/x-icon"
      />
    </Helmet>
  );
};

export default Head;
