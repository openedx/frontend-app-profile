import React from 'react';
import { getConfig } from '@edx/frontend-platform';
import {
  AuthenticatedPageRoute,
  PageRoute,
} from '@edx/frontend-platform/react';
import { Switch } from 'react-router-dom';
import { ProfilePage, NotFoundPage } from '../profile';
import { SkillsBuilder } from '../skills-builder';

const AppRoutes = () => (
  <Switch>
    {getConfig().ENABLE_SKILLS_BUILDER && (
      <PageRoute path="/skills" component={SkillsBuilder} />
    )}
    <AuthenticatedPageRoute path="/u/:username" component={ProfilePage} />
    <PageRoute path="/notfound" component={NotFoundPage} />
    <PageRoute path="*" component={NotFoundPage} />
  </Switch>
);

export default AppRoutes;
