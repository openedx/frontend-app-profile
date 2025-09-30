import { ProfilePage, NotFoundPage } from './profile';
import Main from './Main';
import { withNavigate } from './utils/hoc';

const routes = [
  {
    id: 'org.openedx.frontend.route.profile.main',
    Component: Main,
    children: [
      {
        path: '/u/:username',
        element: (withNavigate(ProfilePage))
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
