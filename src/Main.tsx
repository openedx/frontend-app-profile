import { CurrentAppProvider, getSiteConfig, PageWrap, useIntl } from '@openedx/frontend-base';
import { Helmet } from 'react-helmet';
import { Outlet } from 'react-router-dom';

import { appId } from '@src/constants';
import messages from '@src/messages';

import '@src/style.scss';

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
      {/* No Paragon Container here: the page's banner and its grey band are full-bleed by
          design, so the page puts the header's container around their content instead. */}
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
