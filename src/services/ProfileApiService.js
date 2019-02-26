import camelcaseKeys from 'camelcase-keys';

import apiClient from '../config/apiClient';
import CERTIFICATE_TYPES from '../constants/certificates';
import { configuration } from '../config/environment';
import { unflattenAndTransformKeys, flattenAndTransformKeys } from './utils';

const clientToServerKeyMap = {
  socialLinks: 'social_links',
  education: 'level_of_education',
  profileImage: 'profile_image',
  dateJoined: 'date_joined',
  languageProficiencies: 'language_proficiencies',
  accountPrivacy: 'account_privacy',
  yearOfBirth: 'year_of_birth',
  requiresParentalConsent: 'requires_parental_consent',
};
const serverToClientKeyMap = Object.entries(clientToServerKeyMap).reduce((acc, [key, value]) => {
  acc[value] = key;
  return acc;
}, {});

export function mapServerKey(key) {
  return serverToClientKeyMap[key] || key;
}

export function mapClientKey(key) {
  return clientToServerKeyMap[key] || key;
}

function transformCertificateData(data) {
  const transformedData = [];
  data.forEach((cert) => {
    transformedData.push({
      ...camelcaseKeys(cert),
      certificateType: CERTIFICATE_TYPES[cert.certificate_type],
      downloadUrl: `${configuration.LMS_BASE_URL}${cert.download_url}`,
    });
  });
  return transformedData;
}

export function getAccount(username) {
  return new Promise((resolve, reject) => {
    apiClient
      .get(`${configuration.ACCOUNTS_API_BASE_URL}/${username}`)
      .then((response) => {
        resolve(unflattenAndTransformKeys(response.data, key => mapServerKey(key)));
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export const mapSaveProfileRequestData = (props) => {
  const PROFILE_REQUEST_DATA_MAP = {
    education: 'levelOfEducation',
    socialLinks: socialLinks =>
      Object.entries(socialLinks)
        .filter(([platform, value]) => value !== null) // eslint-disable-line no-unused-vars
        .reduce((acc, [platform, value]) => {
          acc.push({ socialLink: value, platform });
          return acc;
        }, []),
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
    apiClient
      .patch(
        `${configuration.ACCOUNTS_API_BASE_URL}/${username}`,
        flattenAndTransformKeys(data, key => mapClientKey(key)),
        {
          headers: {
            'Content-Type': 'application/merge-patch+json',
          },
        },
      )
      .then((response) => {
        resolve(unflattenAndTransformKeys(response.data, key => mapServerKey(key)));
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function postProfilePhoto(username, formData) {
  return apiClient.post(`${configuration.ACCOUNTS_API_BASE_URL}/${username}/image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export function deleteProfilePhoto(username) {
  return apiClient.delete(`${configuration.ACCOUNTS_API_BASE_URL}/${username}/image`);
}

export function getPreferences(username) {
  const url = `${configuration.PREFERENCES_API_BASE_URL}/${username}`;

  return new Promise((resolve, reject) => {
    apiClient
      .get(url)
      .then(({ data }) => {
        // Unflatten server response
        // visibility.social_links: 'value' becomes { visibility: { socialLinks: 'value' }}
        const preferences = unflattenAndTransformKeys(data, key => mapServerKey(key));
        if (preferences.visibility === undefined) {
          preferences.visibility = {};
        }
        resolve(preferences);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function patchPreferences(username, preferences) {
  const url = `${configuration.PREFERENCES_API_BASE_URL}/${username}`;

  // Flatten object for server
  // { visibility: { socialLinks: 'value' }} becomes visibility.social_links: 'value'
  const data = flattenAndTransformKeys(preferences, key => mapClientKey(key));

  return new Promise((resolve, reject) => {
    apiClient
      .patch(url, data, { headers: { 'Content-Type': 'application/merge-patch+json' } })
      .then(() => {
        // eslint-disable-line no-unused-vars
        // Server response is blank on success
        // resolve(response.data);
        resolve(preferences);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function getCourseCertificates(username) {
  const url = `${configuration.CERTIFICATES_API_BASE_URL}/${username}/`;

  return new Promise((resolve, reject) => {
    apiClient
      .get(url)
      .then(({ data }) => {
        resolve(transformCertificateData(data));
      })
      .catch((error) => {
        reject(error);
      });
  });
}
