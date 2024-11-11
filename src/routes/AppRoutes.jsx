import React from 'react';
import {
  AuthenticatedPageRoute,
  PageWrap,
} from '@edx/frontend-platform/react';
import { Routes, Route } from 'react-router-dom';
import { getConfig } from '@edx/frontend-platform';
import { ProfilePage, NotFoundPage } from '../profile';
import { ProfilePage as NewProfilePage, NotFoundPage as NewNotFoundPage } from '../profile-v2';

const isNewProfileEnabled = process.env.ENABLE_NEW_PROFILE_VIEW === 'true';

const SelectedProfilePage = isNewProfileEnabled ? NewProfilePage : ProfilePage;
const SelectedNotFoundPage = isNewProfileEnabled ? NewNotFoundPage : NotFoundPage;

const AppRoutes = () => (
  <Routes>
    <Route path="/u/:username" element={<AuthenticatedPageRoute><SelectedProfilePage /></AuthenticatedPageRoute>} />
    <Route path="/notfound" element={<PageWrap><SelectedNotFoundPage /></PageWrap>} />
    <Route path="*" element={<PageWrap><SelectedNotFoundPage /></PageWrap>} />
  </Routes>
);

export default AppRoutes;
