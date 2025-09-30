import { ProfilePage, NotFoundPage } from './profile';
import Main from './Main';
import { withNavigate } from './utils/hoc';
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
        element: <ProfilePageWithNavigate />
      },
      {
        path: '/notfound',
        element: (<NotFoundPage />)
      },
      {
        path: '*',
        element: (<NotFoundPage />)
      },
    ]
  }
];
export default routes;
