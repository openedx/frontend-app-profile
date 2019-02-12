import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';

import apiClient from '../data/apiClient';

const apiBaseUrl = `${process.env.LMS_BASE_URL}/api/user/v1/accounts`;

const PROP_TO_STATE_MAP = {
  fullName: 'name',
  userLocation: 'country',
  education: 'levelOfEducation',
  socialLinks: socialLinks => Object.keys(socialLinks).map(linkKey => ({
    platform: linkKey,
    socialLink: socialLinks[linkKey].url,
  })),
};

const mapDataForRequest = (props) => {
  const state = {};
  Object.keys(props).forEach((prop) => {
    const propModifier = PROP_TO_STATE_MAP[prop] || prop;
    if (typeof propModifier === 'function') {
      state[prop] = propModifier(props[prop]);
    } else {
      state[propModifier] = props[prop];
    }
  });
  return state;
};

export function saveUserProfile(username, data) {
  return new Promise((resolve, reject) => {
    apiClient.patch(
      `${apiBaseUrl}/${username}`,
      snakecaseKeys(mapDataForRequest(data), { deep: true }),
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

export function saveUserProfilePhoto(username, formData) {
  return apiClient.post(
    `${apiBaseUrl}/${username}/image`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
}

export function deleteUserProfilePhoto(username) {
  return apiClient.delete(`${apiBaseUrl}/${username}/image`);
}
