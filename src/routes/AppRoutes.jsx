import React from 'react';
import { getConfig } from '@edx/frontend-platform';
import {
  AuthenticatedPageRoute,
  PageWrap,
} from '@edx/frontend-platform/react';
import { Routes, Route } from 'react-router-dom';
import { ProfilePage, NotFoundPage } from '../profile';
import { SkillsBuilder } from '../skills-builder';

const AppRoutes = () => (
  <Routes>
    {getConfig().ENABLE_SKILLS_BUILDER && (
      <Route path="/skills" element={<PageWrap><SkillsBuilder /></PageWrap>} />
    )}
    <Route path="/u/:username" element={<AuthenticatedPageRoute><ProfilePage /></AuthenticatedPageRoute>} />
    <Route path="/notfound" element={<PageWrap><NotFoundPage /></PageWrap>} />
    <Route path="*" element={<PageWrap><NotFoundPage /></PageWrap>} />
  </Routes>
);

export default AppRoutes;
