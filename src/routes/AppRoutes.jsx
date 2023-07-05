import React from 'react';
import {
  AuthenticatedPageRoute,
  PageRoute,
} from '@edx/frontend-platform/react';
import { Switch } from 'react-router-dom';
import { ProfilePage, NotFoundPage } from '../profile';

const AppRoutes = () => (
  <Switch>
    <AuthenticatedPageRoute path="/u/:username" component={ProfilePage} />
    <PageRoute path="/notfound" component={NotFoundPage} />
    <PageRoute path="*" component={NotFoundPage} />
  </Switch>
);

export default AppRoutes;
