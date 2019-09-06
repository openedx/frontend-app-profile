import PubSub from 'pubsub-js';
import { createBrowserHistory } from 'history';
import memoize from 'lodash.memoize';
import getQueryParameters from './getQueryParameters';

export const APP_READY = 'APP.READY';

export const defaultAuthentication = {
  userId: null,
  username: null,
  administrator: false,
};

/* eslint no-underscore-dangle: "off" */
export default class App {
  static _config = null;
  static _ready = false;
  static history = createBrowserHistory();
  static authentication = defaultAuthentication;
  static getQueryParameters = memoize(getQueryParameters);

  static set config(newConfiguration) {
    this._config = newConfiguration;
  }

  static get config() {
    if (this._config === null) {
      throw new Error('App.config has not been initialized. Are you calling it too early?');
    }
    return this._config;
  }

  static subscribe(type, callback) {
    PubSub.subscribe(type, callback);
  }

  static ready() {
    this._ready = true;
    PubSub.publish(APP_READY);
  }

  static set apiClient(apiClient) {
    this._apiClient = apiClient;
  }

  static get apiClient() {
    if (this._apiClient === null) {
      throw new Error('App.apiClient has not been initialized. Are you calling it too early?');
    }
    return this._apiClient;
  }

  static get queryParams() {
    return getQueryParameters(global.location.search);
  }

  static validateConfig(...keys) {
    this.subscribe(APP_READY, () => {
      keys.forEach((key) => {
        if (this.config[key] === undefined) {
          throw new Error(`Configuration error: ${key} is required.`);
        }
      });
    });
  }
}
