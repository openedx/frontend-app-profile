import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { NewRelicLoggingService } from '@edx/frontend-logging';

import App from '../frontend-core/App';
import AppProvider from '../frontend-core/AppProvider';
import initialize from '../frontend-core/initialize';

import configuration from './configuration';
import configureStore from './store';
import messages from './i18n';

import './index.scss';
import ProfileSiteHeader from './components/ProfileSiteHeader';
import ProfileMain from './profile/components/ProfileMain';
import ProfileFooter from './components/ProfileFooter';

initialize(configuration, messages, NewRelicLoggingService).then(() => {
  const store = configureStore();

  ReactDOM.render(
    <AppProvider store={store} authentication={App.authentication}>
      <ProfileSiteHeader />
      <ProfileMain />
      <ProfileFooter />
    </AppProvider>,
    document.getElementById('root'),
  );
});
