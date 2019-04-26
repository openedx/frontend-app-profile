import { logAPIErrorResponse } from '@edx/frontend-logging';
import pick from 'lodash.pick';

import { utils } from '../common';

const { camelCaseObject, convertKeyNames, snakeCaseObject } = utils;

let config = {
  ACCOUNTS_API_BASE_URL: null,
  CERTIFICATES_API_BASE_URL: null,
  LMS_BASE_URL: null,
  PREFERENCES_API_BASE_URL: null,
};

let apiClient = null;

function validateConfiguration(newConfig) {
  Object.keys(config).forEach((key) => {
    if (newConfig[key] === undefined) {
      throw new Error(`Service configuration error: ${key} is required.`);
    }
  });
}

export default function configure(newConfig, newApiClient) {
  validateConfiguration(newConfig);
  config = pick(newConfig, Object.keys(config));
  apiClient = newApiClient;
}

function processAccountData(data) {
  return camelCaseObject(data);
}

function processAndThrowError(error, errorDataProcessor) {
  const processedError = Object.create(error);
  if (error.response && error.response.data && typeof error.response.data === 'object') {
    processedError.processedData = errorDataProcessor(error.response.data);
    throw processedError;
  } else {
    throw error;
  }
}

// GET ACCOUNT
export async function getAccount(username) {
  const { data } = await apiClient.get(`${config.ACCOUNTS_API_BASE_URL}/${username}`);

  // Process response data
  return processAccountData(data);
}

// PATCH PROFILE
export async function patchProfile(username, params) {
  const processedParams = snakeCaseObject(params);

  const { data } = await apiClient
    .patch(`${config.ACCOUNTS_API_BASE_URL}/${username}`, processedParams, {
      headers: {
        'Content-Type': 'application/merge-patch+json',
      },
    })
    .catch((error) => {
      processAndThrowError(error, processAccountData);
    });

  // Process response data
  return processAccountData(data);
}

// POST PROFILE PHOTO

export async function postProfilePhoto(username, formData) {
  // eslint-disable-next-line no-unused-vars
  const { data } = await apiClient.post(
    `${config.ACCOUNTS_API_BASE_URL}/${username}/image`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  ).catch((error) => {
    processAndThrowError(error, camelCaseObject);
  });

  // TODO: Someday in the future the POST photo endpoint
  // will return the new values. At that time we should
  // use the commented line below instead of the separate
  // getAccount request that follows.
  // return camelCaseObject(data);
  const updatedData = await getAccount(username);
  return updatedData.profileImage;
}

// DELETE PROFILE PHOTO

export async function deleteProfilePhoto(username) {
  // eslint-disable-next-line no-unused-vars
  const { data } = await apiClient.delete(`${config.ACCOUNTS_API_BASE_URL}/${username}/image`);

  // TODO: Someday in the future the POST photo endpoint
  // will return the new values. At that time we should
  // use the commented line below instead of the separate
  // getAccount request that follows.
  // return camelCaseObject(data);
  const updatedData = await getAccount(username);
  return updatedData.profileImage;
}

// GET PREFERENCES
export async function getPreferences(username) {
  const { data } = await apiClient.get(`${config.PREFERENCES_API_BASE_URL}/${username}`);

  return camelCaseObject(data);
}

// PATCH PREFERENCES
export async function patchPreferences(username, params) {
  let processedParams = snakeCaseObject(params);
  processedParams = convertKeyNames(processedParams, {
    visibility_bio: 'visibility.bio',
    visibility_course_certificates: 'visibility.course_certificates',
    visibility_country: 'visibility.country',
    visibility_date_joined: 'visibility.date_joined',
    visibility_level_of_education: 'visibility.level_of_education',
    visibility_language_proficiencies: 'visibility.language_proficiencies',
    visibility_name: 'visibility.name',
    visibility_social_links: 'visibility.social_links',
    visibility_time_zone: 'visibility.time_zone',
  });

  await apiClient.patch(`${config.PREFERENCES_API_BASE_URL}/${username}`, processedParams, {
    headers: { 'Content-Type': 'application/merge-patch+json' },
  });

  return params; // TODO: Once the server returns the updated preferences object, return that.
}

// GET COURSE CERTIFICATES

function transformCertificateData(data) {
  const transformedData = [];
  data.forEach((cert) => {
    // download_url may be full url or absolute path.
    // note: using the URL() api breaks in ie 11
    const urlIsPath = typeof cert.download_url === 'string' &&
      cert.download_url.search(/http[s]?:\/\//) !== 0;

    const downloadUrl = urlIsPath ?
      `${config.LMS_BASE_URL}${cert.download_url}` :
      cert.download_url;

    transformedData.push({
      ...camelCaseObject(cert),
      certificateType: cert.certificate_type,
      downloadUrl,
    });
  });
  return transformedData;
}

export async function getCourseCertificates(username) {
  const url = `${config.CERTIFICATES_API_BASE_URL}/${username}/`;
  try {
    const { data } = await apiClient.get(url);
    return transformCertificateData(data);
  } catch (e) {
    logAPIErrorResponse(e);
    return [];
  }
}
