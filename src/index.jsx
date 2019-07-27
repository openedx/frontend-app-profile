import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {
  identifyAnonymousUser,
  identifyAuthenticatedUser,
  sendPageEvent,
  configureAnalytics,
  initializeSegment,
} from '@edx/frontend-analytics';
import { configureLoggingService, NewRelicLoggingService } from '@edx/frontend-logging';
import { getAuthenticatedAPIClient } from '@edx/frontend-auth';
import { configure as configureI18n } from '@edx/frontend-i18n';

import { configuration } from './environment';
import configureStore from './store';
import { configureProfileApiService } from './profile';
import { configureUserAccountApiService } from './common';
import messages from './i18n';

import './index.scss';
import App from './components/App';

const apiClient = getAuthenticatedAPIClient({
  appBaseUrl: configuration.BASE_URL,
  authBaseUrl: configuration.LMS_BASE_URL,
  loginUrl: configuration.LOGIN_URL,
  logoutUrl: configuration.LOGOUT_URL,
  csrfTokenApiPath: configuration.CSRF_TOKEN_API_PATH,
  refreshAccessTokenEndpoint: configuration.REFRESH_ACCESS_TOKEN_ENDPOINT,
  accessTokenCookieName: configuration.ACCESS_TOKEN_COOKIE_NAME,
  userInfoCookieName: configuration.USER_INFO_COOKIE_NAME,
  csrfCookieName: configuration.CSRF_COOKIE_NAME,
  loggingService: NewRelicLoggingService,
});

let callbackAccessToken = null;

/**
 * Temporary check of auth state vs callback access token to help debug and fix any
 * potential problems.
 */
function checkAuthState(functionName, authenticationState) {
  const userIdsMatch = !!(
    callbackAccessToken && callbackAccessToken.user_id &&
    authenticationState && authenticationState.authentication &&
    authenticationState.authentication.userId &&
    callbackAccessToken.user_id === authenticationState.authentication.userId
  );
  const customAttributes = {
    functionName,
    callbackAccessToken,
    authenticationState,
    userIdsMatch,
  };
  NewRelicLoggingService.logInfo(`checkAuthState: ${functionName}: userIdsMatch=${userIdsMatch}`, customAttributes);
}

/**
 * We need to merge the application configuration with the authentication state
 * so that we can hand it all to the redux store's initializer.
 */
function createInitialState() {
  const authenticationState = apiClient.getAuthenticationState();
  checkAuthState('createInitialState', authenticationState);
  return Object.assign({}, { configuration }, authenticationState);
}

function configure() {
  configureI18n(configuration, messages);

  const { store, history } = configureStore(createInitialState(), configuration.ENVIRONMENT);

  configureLoggingService(NewRelicLoggingService);
  configureProfileApiService(configuration, apiClient);
  configureUserAccountApiService(configuration, apiClient);
  initializeSegment(configuration.SEGMENT_KEY);
  configureAnalytics({
    loggingService: NewRelicLoggingService,
    authApiClient: apiClient,
    analyticsApiBaseUrl: configuration.LMS_BASE_URL,
  });

  return {
    store,
    history,
  };
}

apiClient.ensurePublicOrAuthenticationAndCookies(
  window.location.pathname,
  (accessToken) => {
    callbackAccessToken = accessToken;
    checkAuthState('ensurePublicOrAuthenticationAndCookies:callback', apiClient.getAuthenticationState());

    const { store, history } = configure();

    ReactDOM.render(<App store={store} history={history} />, document.getElementById('root'));

    if (accessToken) {
      identifyAuthenticatedUser(accessToken.userId);
    } else {
      // TODO: Could this ever happen?
      // - If this did happen, wouldn't we want to raise an error?
      // - Adding error logging for now.
      NewRelicLoggingService.logError('Empty accessToken returned from ' +
        'ensurePublicOrAuthenticationAndCookies callback.');
      identifyAnonymousUser();
    }
    sendPageEvent();
  },
);
