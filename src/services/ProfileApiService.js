import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';

import apiClient from '../config/apiClient';
import { configuration } from '../config/environment';
import { unflattenAndTransformKeys, flattenAndTransformKeys } from './utils';

const accountsApiBaseUrl = `${configuration.LMS_BASE_URL}/api/user/v1/accounts`;
const preferencesApiBaseUrl = `${configuration.LMS_BASE_URL}/api/user/v1/preferences`;
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
  userLocation: 'user_location',
};
const serverClientKeyMap = Object.entries(clientServerKeyMap).reduce((acc, [key, value]) => {
  acc[value] = key;
  return acc;
}, {});


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

export function getPreferences(username) {
  const url = `${preferencesApiBaseUrl}/${username}`;

  return new Promise((resolve, reject) => {
    apiClient.get(url)
      .then(({ data }) => {
        // Unflatten server response
        // visibility.social_links: 'value' becomes { visibility: { socialLinks: 'value' }}
        resolve(unflattenAndTransformKeys(data, key => serverClientKeyMap[key] || key));
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function patchPreferences(username, preferences) {
  const url = `${preferencesApiBaseUrl}/${username}`;

  // Flatten object for server
  // { visibility: { socialLinks: 'value' }} becomes visibility.social_links: 'value'
  const data = flattenAndTransformKeys(preferences, key => clientServerKeyMap[key] || key);

  return new Promise((resolve, reject) => {
    apiClient.patch(
      url,
      data,
      { headers: { 'Content-Type': 'application/merge-patch+json' } },
    )
      .then((response) => { // eslint-disable-line no-unused-vars
        // Server response is blank on success
        // resolve(response.data);
        resolve(preferences);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function getCourseCertificates(username) { // eslint-disable-line no-unused-vars
  return new Promise((resolve, reject) => { // eslint-disable-line no-unused-vars
    const dummyData = [
      // {
      //   type: {
      //     key: 'micro_masters',
      //     name: 'Micro Masters',
      //   },
      //   title: 'Microtonal Scales',
      //   organization: 'New England Conservatory',
      //   downloadUrl: 'https://pics.me.me/booplesnoot-36468371.png',
      // },
      // {
      //   type: {
      //     key: 'micro_masters',
      //     name: 'Micro Masters',
      //   },
      //   title: 'Kazoo Pinch Harmonics',
      //   organization: 'New England Conservatory',
      //   downloadUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR88selLYRHDQemO8MnY3w3ajlSuKZcoRhVTp3eGvKq2HMRTn8q',
      // },
    ];
    setTimeout(() => {
      resolve(dummyData);
    }, 200);
  });
}
