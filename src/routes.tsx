import { ProfilePage, NotFoundPage } from './profile';
import Main from './Main';
import { withNavigate } from './utils/hoc';
import { AuthenticatedPageRoute, PageWrap } from '@openedx/frontend-base';
import { RoleRouteObject } from '@openedx/frontend-base/types';

const ProfilePageWithNavigate = withNavigate(ProfilePage);

const routes: RoleRouteObject[] = [
  {
    id: 'org.openedx.frontend.route.profile.main',
    path: '/',
    Component: Main,
    children: [
      {
        path: '/u/:username',
        element: <AuthenticatedPageRoute><ProfilePageWithNavigate /></AuthenticatedPageRoute>
      },
      {
        path: '/notfound',
        element: (<PageWrap><NotFoundPage /></PageWrap>)
      },
      {
        path: '*',
        element: (<PageWrap><NotFoundPage /></PageWrap>)
      },
    ]
  }
];
export default routes;
