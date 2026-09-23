import { CurrentAppProvider, getSiteConfig, PageWrap, useIntl } from '@openedx/frontend-base';
import { Helmet } from 'react-helmet';
import { Outlet } from 'react-router-dom';

import { appId } from '@src/constants';
import messages from '@src/messages';

import '@src/index.scss';

const Main = () => {
  const { formatMessage } = useIntl();
  return (
    <CurrentAppProvider appId={appId}>
      <Helmet>
        <title>
          {formatMessage(messages['profile.page.title'], {
            siteName: getSiteConfig().siteName,
          })}
        </title>
      </Helmet>
      {/* No Paragon Container: the page's banner is full-bleed by design. */}
      <main className="profile-app" id="main">
        {/* Keeps the per-navigation page event `AuthenticatedPageRoute` used to send. */}
        <PageWrap>
          <Outlet />
        </PageWrap>
      </main>
    </CurrentAppProvider>
  );
};

export default Main;
