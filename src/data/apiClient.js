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


export function getPreferences(username) {
  const url = `${lmsBaseUrl}/api/user/v1/preferences/${username}`;

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

export function savePreferences(username, preferences) {
  const url = `${lmsBaseUrl}/api/user/v1/preferences/${username}`;
  // const data = {
  //   "account_privacy": "custom",
  //   "visibility.bio": "all_users",
  //   "visibility.country": "private",
  //   "visibility.language_proficiencies": "all_users"
  // };

  return new Promise((resolve, reject) => {
    apiClient.patch(
      url,
      preferences,
      { headers: { 'Content-Type': 'application/merge-patch+json' } },
    )
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}


export default apiClient;
