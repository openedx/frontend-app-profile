import React from 'react';
import PropTypes from 'prop-types';
import {
  AuthenticatedPageRoute,
  PageWrap,
} from '@edx/frontend-platform/react';
import { Routes, Route } from 'react-router-dom';
import { ProfilePage, NotFoundPage } from '../profile';
import { ProfilePage as NewProfilePage, NotFoundPage as NewNotFoundPage } from '../profile-v2';

const AppRoutes = ({ isNewProfileEnabled }) => {
  const SelectedProfilePage = isNewProfileEnabled ? NewProfilePage : ProfilePage;
  const SelectedNotFoundPage = isNewProfileEnabled ? NewNotFoundPage : NotFoundPage;

  return (
    <Routes>
      <Route path="/u/:username" element={<AuthenticatedPageRoute><SelectedProfilePage /></AuthenticatedPageRoute>} />
      <Route path="/notfound" element={<PageWrap><SelectedNotFoundPage /></PageWrap>} />
      <Route path="*" element={<PageWrap><SelectedNotFoundPage /></PageWrap>} />
    </Routes>
  );
};

AppRoutes.propTypes = {
  isNewProfileEnabled: PropTypes.bool,
};

AppRoutes.defaultProps = {
  isNewProfileEnabled: null,
};

export default AppRoutes;
