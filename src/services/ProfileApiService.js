import apiClient from '../config/apiClient';
import CERTIFICATE_TYPES from '../constants/certificates';
import { configuration } from '../config/environment';
import {
  camelCaseObject,
  convertKeyNames,
  snakeCaseObject,
} from './utils';

function processAccountData(data) {
  const result = camelCaseObject(data);
  return convertKeyNames(result, {
    levelOfEducation: 'education',
  });
}

// GET ACCOUNT
export async function getAccount(username) {
  const { data } = await apiClient.get(`${configuration.ACCOUNTS_API_BASE_URL}/${username}`);

  // Process response data
  return processAccountData(data);
}

// PATCH PROFILE
export async function patchProfile(username, params) {
  let processedParams = snakeCaseObject(params);
  processedParams = convertKeyNames(processedParams, {
    education: 'level_of_education',
  });

  const { data } = await apiClient.patch(
    `${configuration.ACCOUNTS_API_BASE_URL}/${username}`,
    processedParams,
    {
      headers: {
        'Content-Type': 'application/merge-patch+json',
      },
    },
  ).catch((error) => {
    const processedError = Object.create(error);
    const fieldErrors = Object.entries(processAccountData(error.response.data.field_errors))
      .reduce((acc, [fieldKey, messages]) => {
        acc[fieldKey] = messages.userMessage;
        return acc;
      }, {});
    processedError.fieldErrors = fieldErrors;
    throw processedError;
  });

  // Process response data
  return processAccountData(data);
}

// POST PROFILE PHOTO

export async function postProfilePhoto(username, formData) {
  const { data } = await apiClient.post(
    `${configuration.ACCOUNTS_API_BASE_URL}/${username}/image`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  return camelCaseObject(data);
}

// DELETE PROFILE PHOTO

export async function deleteProfilePhoto(username) {
  const { data } = await apiClient.delete(`${configuration.ACCOUNTS_API_BASE_URL}/${username}/image`);
  return camelCaseObject(data);
}

// GET PREFERENCES
export async function getPreferences(username) {
  const { data } = await apiClient.get(`${configuration.PREFERENCES_API_BASE_URL}/${username}`);

  const result = camelCaseObject(data);
  return convertKeyNames(result, {
    visibilityLevelOfEducation: 'visibilityEducation',
  });
}

// PATCH PREFERENCES
export async function patchPreferences(username, params) {
  let processedParams = snakeCaseObject(params);
  processedParams = convertKeyNames(processedParams, {
    visibility_bio: 'visibility.bio',
    visibility_course_certificates: 'visibility.course_certificates',
    visibility_country: 'visibility.country',
    visibility_date_joined: 'visibility.date_joined',
    visibility_education: 'visibility.level_of_education',
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
      certificateType: CERTIFICATE_TYPES[cert.certificate_type],
      downloadUrl: `${configuration.LMS_BASE_URL}${cert.download_url}`,
    });
  });
  return transformedData;
}


export async function getCourseCertificates(username) {
  const url = `${configuration.CERTIFICATES_API_BASE_URL}/${username}/`;
  const { data } = await apiClient.get(url);

  return transformCertificateData(data);
}
