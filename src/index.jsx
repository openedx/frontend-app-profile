import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import { identifyAuthenticatedUser, sendPageEvent } from '@edx/frontend-analytics';

import './config/analytics';
import configureStore from './config/configureStore';
import apiClient from './config/apiClient';
import { handleRtl } from './i18n/i18n-loader';

import './index.scss';

import App from './components/App';

if (apiClient.ensurePublicOrAuthencationAndCookies(window.location.pathname)) {
  const { store, history } = configureStore();

  if (process.env.NODE_ENV === 'production') {
    handleRtl();
  }

  ReactDOM.render(<App store={store} history={history} />, document.getElementById('root'));

  identifyAuthenticatedUser();
  sendPageEvent();
}
