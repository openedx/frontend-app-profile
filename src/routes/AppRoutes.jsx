import React from 'react';
import {
  AuthenticatedPageRoute,
  PageWrap,
} from '@edx/frontend-platform/react';
import { Routes, Route } from 'react-router-dom';
import { ProfilePage, NotFoundPage } from '../profile-v2';

const AppRoutes = () => (
  <Routes>
    <Route path="/u/:username" element={<AuthenticatedPageRoute><ProfilePage /></AuthenticatedPageRoute>} />
    <Route path="/notfound" element={<PageWrap><NotFoundPage /></PageWrap>} />
    <Route path="*" element={<PageWrap><NotFoundPage /></PageWrap>} />
  </Routes>
);

export default AppRoutes;
