import 'core-js/stable';
import 'regenerator-runtime/runtime';

import {
  APP_INIT_ERROR,
  APP_READY,
  initialize,
  mergeConfig,
  subscribe,
  getConfig,
} from '@edx/frontend-platform';
import {
  AppProvider,
  ErrorPage,
} from '@edx/frontend-platform/react';

import React from 'react';
// eslint-disable-next-line import/no-unresolved
import { createRoot } from 'react-dom/client';

import Header from '@edx/frontend-component-header';
import FooterSlot from '@openedx/frontend-slot-footer';

import messages from './i18n';
import configureStore from './data/configureStore';

import Head from './head/Head';

import AppRoutes from './routes/AppRoutes';

const rootNode = createRoot(document.getElementById('root'));
subscribe(APP_READY, async () => {
  const isNewProfileEnabled = getConfig().ENABLE_NEW_PROFILE_VIEW === 'true';
  if (isNewProfileEnabled) {
    await import('./index-v2.scss');
  } else {
    await import('./index.scss');
  }
  rootNode.render(
    <AppProvider store={configureStore()}>
      <Head />
      <Header />
      <main id="main">
        <AppRoutes isNewProfileEnabled={isNewProfileEnabled} />
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
        ENABLE_NEW_PROFILE_VIEW: process.env.ENABLE_NEW_PROFILE_VIEW || null,
      }, 'App loadConfig override handler');
    },
  },
});
