import 'core-js/stable';
import 'regenerator-runtime/runtime';

import {
  APP_INIT_ERROR,
  APP_READY,
  getConfig,
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
import { Route, Switch } from 'react-router-dom';

import Header, { messages as headerMessages } from './Header/dist';
import Footer, { messages as footerMessages } from './Footer/dist';

import appMessages from './i18n';
import { ProfilePage, NotFoundPage } from './profile';
import { SkillsBuilder } from './skills-builder';
import configureStore from './data/configureStore';

import './index.scss';
import Head from './head/Head';

subscribe(APP_READY, () => {
  ReactDOM.render(
    <AppProvider store={configureStore()}>
      <Head />
      <Header />
      <main>
        <Switch>
          {getConfig().ENABLE_SKILLS_BUILDER && (
            <Route path="/skills" component={SkillsBuilder} />
          )}
          <Route path="/u/:username" component={ProfilePage} />
          <Route path="/notfound" component={NotFoundPage} />
          <Route path="*" component={NotFoundPage} />
        </Switch>
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
  messages: [
    appMessages,
    headerMessages,
    footerMessages,
  ],
  requireAuthenticatedUser: true,
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
      }, 'App loadConfig override handler');
    },
  },
});
