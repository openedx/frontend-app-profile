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
import ReactDOM from 'react-dom';

import Header from '@edx/frontend-component-header';
import Footer from '@edx/frontend-component-footer';

import messages from './i18n';
import configureStore from './data/configureStore';

import './index.scss';
import Head from './head/Head';

import AppRoutes from './routes/AppRoutes';

subscribe(APP_READY, () => {
  ReactDOM.render(
    <AppProvider store={configureStore()}>
      <Head />
      <Header />
      <main>
        <AppRoutes />
      </main>
      <Footer />
    </AppProvider>,
    document.getElementById('root'),
  );
});

subscribe(APP_INIT_ERROR, (error) => {
  ReactDOM.render(<ErrorPage message={error.message} />, document.getElementById('root'));
});

initialize({
  messages,
  hydrateAuthenticatedUser: true,
  handlers: {
    config: () => {
      mergeConfig({
        COLLECT_YEAR_OF_BIRTH: process.env.COLLECT_YEAR_OF_BIRTH,
        ENABLE_SKILLS_BUILDER: process.env.ENABLE_SKILLS_BUILDER,
        ENABLE_SKILLS_BUILDER_PROFILE: process.env.ENABLE_SKILLS_BUILDER_PROFILE,
        ALGOLIA_APP_ID: process.env.ALGOLIA_APP_ID || null,
        ALGOLIA_JOBS_INDEX_NAME: process.env.ALGOLIA_JOBS_INDEX_NAME || null,
        ALGOLIA_PRODUCT_INDEX_NAME: process.env.ALGOLIA_PRODUCT_INDEX_NAME || null,
        ALGOLIA_SEARCH_API_KEY: process.env.ALGOLIA_SEARCH_API_KEY || null,
        MARKETING_SITE_SEARCH_URL: process.env.SEARCH_CATALOG_URL || null,
      }, 'App loadConfig override handler');
    },
  },
});
