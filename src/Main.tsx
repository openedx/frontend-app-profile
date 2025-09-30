import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { CurrentAppProvider } from '@openedx/frontend-base';
import { Provider as ReduxProvider } from 'react-redux';
import React from 'react';
import configureStore from './data/configureStore';
import { appId } from './constants';

import './app.scss';
import Head from './head/Head';

import { Outlet } from 'react-router-dom';

const Main = () => (
  <CurrentAppProvider appId={appId}>
    <ReduxProvider store={configureStore()}>
      <Head />
      <main id="main">
        <Outlet />
      </main>
    </ReduxProvider>
  </CurrentAppProvider>
);

export default Main;

/* TODO: remove?
initialize({
  messages,
  hydrateAuthenticatedUser: true,
  handlers: {
    config: () => {
      mergeConfig({
        COLLECT_YEAR_OF_BIRTH: process.env.COLLECT_YEAR_OF_BIRTH,
        ENABLE_SKILLS_BUILDER_PROFILE: process.env.ENABLE_SKILLS_BUILDER_PROFILE,
      }, 'App loadConfig override handler');
    },
  },
});
*/
