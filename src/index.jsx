import 'babel-polyfill';

import { App, AppProvider, APP_ERROR, APP_READY, ErrorPage } from '@edx/frontend-base';
import { NewRelicLoggingService } from '@edx/frontend-logging';
import React from 'react';
import ReactDOM from 'react-dom';

import Header, { messages as headerMessages } from '@edx/frontend-component-header';
import Footer from '../footer/Footer';

import appMessages from './i18n';
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

App.subscribe(APP_ERROR, (error) => {
  ReactDOM.render(<ErrorPage message={error.message} />, document.getElementById('root'));
});

App.initialize({ messages: [appMessages, headerMessages], loggingService: NewRelicLoggingService });

