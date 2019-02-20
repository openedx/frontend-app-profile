import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';

import apiClient from '../data/apiClient';
import { configuration } from '../config';

const accountsApiBaseUrl = `${configuration.LMS_BASE_URL}/api/user/v1/accounts`;
const preferencesApiBaseUrl = `${configuration.LMS_BASE_URL}/api/user/v1/preferences`;

export function getProfile(username) {
  return new Promise((resolve, reject) => {
    apiClient
      .get(`${accountsApiBaseUrl}/${username}`)
      .then((response) => {
        resolve(camelcaseKeys(response.data, { deep: true }));
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export const mapSaveProfileRequestData = (props) => {
  const PROFILE_REQUEST_DATA_MAP = {
    fullName: 'name',
    userLocation: 'country',
    education: 'levelOfEducation',
    socialLinks: socialLinks => socialLinks.filter(({ socialLink }) => socialLink !== null),
  };
  const state = {};

  Object.keys(props).forEach((prop) => {
    const propModifier = PROFILE_REQUEST_DATA_MAP[prop] || prop;
    if (typeof propModifier === 'function') {
      state[prop] = propModifier(props[prop]);
    } else {
      state[propModifier] = props[prop];
    }
  });
  return state;
};

export function patchProfile(username, data) {
  return new Promise((resolve, reject) => {
    apiClient.patch(
      `${accountsApiBaseUrl}/${username}`,
      snakecaseKeys(mapSaveProfileRequestData(data), { deep: true }),
      {
        headers: {
          'Content-Type': 'application/merge-patch+json',
        },
      },
    )
      .then((response) => {
        resolve(camelcaseKeys(response.data, { deep: true }));
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function postProfilePhoto(username, formData) {
  return apiClient.post(`${accountsApiBaseUrl}/${username}/image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export function deleteProfilePhoto(username) {
  return apiClient.delete(`${accountsApiBaseUrl}/${username}/image`);
}

export function getUserPreference(username, preferenceKey) {
  return new Promise((resolve, reject) => {
    apiClient.get(`${preferencesApiBaseUrl}/${username}/${preferenceKey}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

