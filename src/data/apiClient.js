import _ from 'lodash';
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

const clientServerKeyMap = {
  bio: 'bio',
  socialLinks: 'social_links',
  country: 'country',
  education: 'level_of_education',
  fullName: 'name',
  username: 'username',
  profileImage: 'profile_image',
  dateJoined: 'date_joined',
  languageProficiencies: 'language_proficiencies',
  accountPrivacy: 'account_privacy',
};

const serverClientKeyMap = _.invert(clientServerKeyMap);


export function getPreferences(username) {
  const url = `${lmsBaseUrl}/api/user/v1/preferences/${username}`;

  return new Promise((resolve, reject) => {
    apiClient.get(url)
      .then(({ data }) => {
        const unflattenAndTransformKeys = (acc, key) => {
          _.set(
            acc,
            key.split('.').map(pathKey => serverClientKeyMap[pathKey] || pathKey),
            data[key],
          );
          return acc;
        };
        const preferences = Object.keys(data).reduce(unflattenAndTransformKeys, {});
        resolve(preferences);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function savePreferences(username, preferences) {
  const url = `${lmsBaseUrl}/api/user/v1/preferences/${username}`;
  const data = {};
  const flattenAndTransformKeys = (prevKeys, currentValue) => {
    if (typeof currentValue !== 'object') {
      const serverKey = prevKeys.map(key => serverClientKeyMap[key] || key).join('.');
      data[serverKey] = currentValue;
      return;
    }
    Object.keys(currentValue).forEach((key) => {
      flattenAndTransformKeys(prevKeys.concat(key), currentValue[key]);
    });
  };
  flattenAndTransformKeys([], preferences);

  return new Promise((resolve, reject) => {
    apiClient.patch(
      url,
      data,
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
