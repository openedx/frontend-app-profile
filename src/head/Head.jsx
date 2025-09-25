import React from 'react';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { getConfig } from '@edx/frontend-platform';

import messages from './messages';

const Head = ({ intl }) => (
  <>
    <title>
      {intl.formatMessage(messages['profile.page.title'], { siteName: getConfig().SITE_NAME })}
    </title>
    <link rel="shortcut icon" href={getConfig().FAVICON_URL} type="image/x-icon" />
  </>
);

Head.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(Head);
