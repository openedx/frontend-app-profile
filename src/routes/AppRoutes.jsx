import React from 'react';
import {
  AuthenticatedPageRoute,
  PageWrap,
} from '@edx/frontend-platform/react';
import { Routes, Route } from 'react-router-dom';
import { ProfilePage, NotFoundPage } from '../profile';
import { ProfilePage as NewProfilePage, NotFoundPage as NewNotFoundPage } from '../profile-v2';

const isNewProfileEnabled = process.env.ENABLE_NEW_PROFILE_VIEW === 'true';

const AppRoutes = () => (
  <Routes>
    <Route
      path="/u/:username"
      element={
        (
          <AuthenticatedPageRoute>
            {isNewProfileEnabled ? <NewProfilePage /> : <ProfilePage />}
          </AuthenticatedPageRoute>
        )
      }
    />
    <Route
      path="/notfound"
      element={<PageWrap>{isNewProfileEnabled ? <NewNotFoundPage /> : <NotFoundPage />}</PageWrap>}
    />
    <Route
      path="*"
      element={<PageWrap>{isNewProfileEnabled ? <NewNotFoundPage /> : <NotFoundPage />}</PageWrap>}
    />
  </Routes>
);

export default AppRoutes;
