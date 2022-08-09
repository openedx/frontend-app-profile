import "core-js/stable";
import "regenerator-runtime/runtime";

import {
  APP_INIT_ERROR,
  APP_READY,
  initialize,
  subscribe,
} from "@edx/frontend-platform";
import { AppProvider, ErrorPage } from "@edx/frontend-platform/react";

import React from "react";
import ReactDOM from "react-dom";
import { Route, Switch } from "react-router-dom";
import Header from "./profile/Header/Header";
import Footer from "./profile/Footer/Footer";

import appMessages from "./i18n";
import { ProfilePage, NotFoundPage } from "./profile";
import configureStore from "./data/configureStore";

import "./index.scss";
import "./assets/favicon.ico";

subscribe(APP_READY, () => {
  ReactDOM.render(
    <AppProvider store={configureStore()}>
      <Header />
      <main>
        <Switch>
          <Route path="/u/:username" component={ProfilePage} />
          <Route path="/notfound" component={NotFoundPage} />
          <Route path="*" component={NotFoundPage} />
        </Switch>
      </main>
      <Footer />
    </AppProvider>,
    document.getElementById("root")
  );
});

subscribe(APP_INIT_ERROR, (error) => {
  ReactDOM.render(
    <ErrorPage message={error.message} />,
    document.getElementById("root")
  );
});

initialize({
  messages: [appMessages],
  requireAuthenticatedUser: true,
  hydrateAuthenticatedUser: true,
});
