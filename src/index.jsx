import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';

import configureStore from './config/configureStore';
import apiClient from './config/apiClient';
import { identifyUser } from './analytics';

import './index.scss';

import App from './components/App';

if (apiClient.ensurePublicOrAuthencationAndCookies(window.location.pathname)) {
  const store = configureStore();

  ReactDOM.render(<App store={store} />, document.getElementById('root'));

  // identify user for future analytics calls
  // TODO: Call before each page call.
  identifyUser();
}
