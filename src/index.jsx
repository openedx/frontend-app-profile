import 'babel-polyfill';

import { App, AppProvider, APP_ERROR, APP_READY, ErrorPage, initialize } from '@edx/frontend-base';
import { NewRelicLoggingService } from '@edx/frontend-logging';
import React from 'react';
import ReactDOM from 'react-dom';

import Footer from '../footer/Footer';
import Header from '../header/Header';

import messages from './i18n';
import './index.scss';
import ProfileMain from './profile/components/ProfileMain';
import configureStore from './store';

App.subscribe(APP_READY, () => {
  ReactDOM.render(
    <AppProvider store={configureStore()}>
      <Header />
      <ProfileMain />
      <Footer />
    </AppProvider>,
    document.getElementById('root'),
  );
});

App.subscribe(APP_ERROR, () => {
  ReactDOM.render(<ErrorPage message={App.error.message} />, document.getElementById('root'));
});

initialize({ messages, loggingService: NewRelicLoggingService });
