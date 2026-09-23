import { authenticatedLoader, RoleRouteObject } from '@openedx/frontend-base';

import { profileRole } from '@src/constants';

// The lazy imports stay relative: tsc-alias takes the chunk name in the webpack comment for the
// module path, so an `@src` specifier there would survive into the published build unresolved.
const routes: RoleRouteObject[] = [
  {
    id: 'org.openedx.frontend.route.profile.main',
    // The role sits here rather than on the child: the shell's header and the LMS both build
    // `<the profile role's URL>/u/<username>`, so the role has to resolve to `profile`.
    path: 'profile',
    // Viewing anyone's profile requires a signed-in user, as `AuthenticatedPageRoute` did.
    loader: authenticatedLoader,
    handle: {
      roles: [profileRole],
    },
    async lazy() {
      const module = await import(/* webpackChunkName: "profile-main" */ './Main');
      return { Component: module.default };
    },
    children: [
      {
        // `/profile` on its own names no learner, so it is as unknown as a bad username.
        index: true,
        async lazy() {
          const module = await import(/* webpackChunkName: "profile-not-found" */ './profile/NotFoundPage');
          return { Component: module.default };
        },
      },
      {
        path: 'u/:username',
        async lazy() {
          const module = await import(/* webpackChunkName: "profile-page" */ './profile/ProfilePage');
          return { Component: module.default };
        },
      },
    ],
  },
];

export default routes;
