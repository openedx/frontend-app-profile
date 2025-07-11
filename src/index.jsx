import 'core-js/stable';
import 'regenerator-runtime/runtime';

import {
  APP_INIT_ERROR,
  APP_READY,
  initialize,
  mergeConfig,
  subscribe,
} from '@edx/frontend-platform';
import {
  AppProvider,
  ErrorPage,
} from '@edx/frontend-platform/react';

import React from 'react';
// eslint-disable-next-line import/no-unresolved
import { createRoot } from 'react-dom/client';

import Header from '@edx/frontend-component-header';
import { FooterSlot } from '@edx/frontend-component-footer';

import messages from './i18n';
import configureStore from './data/configureStore';

import Head from './head/Head';

import AppRoutes from './routes/AppRoutes';

import './index.scss';

const rootNode = createRoot(document.getElementById('root'));
subscribe(APP_READY, async () => {
  rootNode.render(
    <AppProvider store={configureStore()}>
      <Head />
      <Header />
      <main id="main">
        <AppRoutes />
      </main>
      <FooterSlot />
    </AppProvider>,
    document.getElementById('root'),
  );
});

subscribe(APP_INIT_ERROR, (error) => {
  rootNode.render(<ErrorPage message={error.message} />, document.getElementById('root'));
});

initialize({
  messages,
  hydrateAuthenticatedUser: true,
  handlers: {
    config: () => {
      mergeConfig({
        COLLECT_YEAR_OF_BIRTH: process.env.COLLECT_YEAR_OF_BIRTH,
        ENABLE_SKILLS_BUILDER_PROFILE: process.env.ENABLE_SKILLS_BUILDER_PROFILE,
        DISABLE_VISIBILITY_EDITING: process.env.DISABLE_VISIBILITY_EDITING,
      }, 'App loadConfig override handler');
    },
  },
});
