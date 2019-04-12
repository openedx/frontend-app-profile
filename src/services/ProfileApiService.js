import LoggingService from '@edx/frontend-logging';

import apiClient from '../config/apiClient';
import { configuration } from '../config/environment';
import {
  camelCaseObject,
  convertKeyNames,
  snakeCaseObject,
} from './utils';

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
  const { data } = await apiClient.get(`${configuration.ACCOUNTS_API_BASE_URL}/${username}`);

  // Process response data
  return processAccountData(data);
}

// PATCH PROFILE
export async function patchProfile(username, params) {
  const processedParams = snakeCaseObject(params);

  const { data } = await apiClient.patch(
    `${configuration.ACCOUNTS_API_BASE_URL}/${username}`,
    processedParams,
    {
      headers: {
        'Content-Type': 'application/merge-patch+json',
      },
    },
  ).catch((error) => {
    processAndThrowError(error, processAccountData);
  });

  // Process response data
  return processAccountData(data);
}

// POST PROFILE PHOTO

export async function postProfilePhoto(username, formData) {
  // eslint-disable-next-line no-unused-vars
  const { data } = await apiClient.post(
    `${configuration.ACCOUNTS_API_BASE_URL}/${username}/image`,
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
  const { data } = await apiClient.delete(`${configuration.ACCOUNTS_API_BASE_URL}/${username}/image`);

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
  const { data } = await apiClient.get(`${configuration.PREFERENCES_API_BASE_URL}/${username}`);

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

  await apiClient.patch(
    `${configuration.PREFERENCES_API_BASE_URL}/${username}`,
    processedParams,
    { headers: { 'Content-Type': 'application/merge-patch+json' } },
  );

  return params; // TODO: Once the server returns the updated preferences object, return that.
}

// GET COURSE CERTIFICATES

function transformCertificateData(data) {
  const transformedData = [];
  data.forEach((cert) => {
    transformedData.push({
      ...camelCaseObject(cert),
      certificateType: cert.certificate_type,
      downloadUrl: new URL(cert.download_url, configuration.LMS_BASE_URL).toString(),
    });
  });
  return transformedData;
}


export async function getCourseCertificates(username) {
  const url = `${configuration.CERTIFICATES_API_BASE_URL}/${username}/`;
  try {
    const { data } = await apiClient.get(url);
    return transformCertificateData(data);
  } catch (e) {
    LoggingService.logAPIErrorResponse(e);
    return [];
  }
}
