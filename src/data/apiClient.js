import { getAuthenticatedAPIClient } from '@edx/frontend-auth';

import { configuration } from '../config';

const lmsBaseUrl = process.env.LMS_BASE_URL;

const apiClient = getAuthenticatedAPIClient({
  appBaseUrl: configuration.BASE_URL,
  authBaseUrl: process.env.LMS_BASE_URL,
  loginUrl: configuration.LOGIN_URL,
  logoutUrl: configuration.LOGOUT_URL,
  csrfTokenApiPath: process.env.CSRF_TOKEN_API_PATH,
  refreshAccessTokenEndpoint: configuration.REFRESH_ACCESS_TOKEN_ENDPOINT,
  accessTokenCookieName: configuration.ACCESS_TOKEN_COOKIE_NAME,
  csrfCookieName: configuration.CSRF_COOKIE_NAME,
});


export function getUserPreference(username, preferenceKey) {
  const url = `${lmsBaseUrl}/api/user/v1/preferences/${username}/${preferenceKey}`;

  return new Promise((resolve, reject) => {
    apiClient.get(url)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}


export default apiClient;
