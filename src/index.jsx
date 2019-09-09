import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { NewRelicLoggingService } from '@edx/frontend-logging';

import { App, APP_READY, APP_ERROR, AppProvider, ErrorPage, initialize } from '../frontend-core';

import configuration from './configuration';
import configureStore from './store';
import messages from './i18n';

import './index.scss';
import ProfileHeader from './components/ProfileHeader';
import ProfileMain from './profile/components/ProfileMain';
import ProfileFooter from './components/ProfileFooter';

App.subscribe(APP_READY, () => {
  ReactDOM.render(
    <AppProvider store={configureStore()} authentication={App.authentication}>
      <ProfileHeader />
      <ProfileMain />
      <ProfileFooter />
    </AppProvider>,
    document.getElementById('root'),
  );
});

App.subscribe(APP_ERROR, () => {
  ReactDOM.render(<ErrorPage message={App.error.message} />, document.getElementById('root'));
});

initialize(configuration, messages, NewRelicLoggingService);
