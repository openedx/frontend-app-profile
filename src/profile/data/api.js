import {
  camelCaseObject,
  convertKeyNames,
  getAuthenticatedHttpClient as getHttpClient,
  getSiteConfig,
  logError,
  snakeCaseObject,
} from '@openedx/frontend-base';

import { FIELD_LABELS } from '@src/profile/data/constants';

function processAccountData(data) {
  const processedData = camelCaseObject(data);
  return {
    ...processedData,
    socialLinks: Array.isArray(processedData.socialLinks) ? processedData.socialLinks : [],
    languageProficiencies: Array.isArray(processedData.languageProficiencies)
      ? processedData.languageProficiencies : [],
    name: processedData.name || null,
    bio: processedData.bio || null,
    country: processedData.country || null,
    levelOfEducation: processedData.levelOfEducation || null,
    profileImage: processedData.profileImage || {},
    yearOfBirth: processedData.yearOfBirth || null,
  };
}

// v2 refuses a change with the standard error body, whose `errors` lists the messages for each
// refused property, or for an item inside one, such as `social_links[0].social_link`. The forms
// show one message per property, as v1's `field_errors` gave them.
function processAccountErrors(data) {
  const messages = {};
  Object.entries(data.errors || {}).forEach(([name, fieldMessages]) => {
    const field = name.split(/[[.]/)[0];
    messages[field] = [...(messages[field] || []), ...fieldMessages];
  });
  if (Object.keys(messages).length === 0) {
    return camelCaseObject(data);
  }
  const fieldErrors = Object.fromEntries(
    Object.entries(messages).map(([field, list]) => [field, { user_message: list.join(' ') }]),
  );
  return camelCaseObject({ field_errors: fieldErrors });
}

function processPhotoErrors(data) {
  return { userMessage: (data.errors?.file || []).join(' ') || data.detail };
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

export async function getAccount(username) {
  const { data } = await getHttpClient().get(`${getSiteConfig().lmsBaseUrl}/api/user/v2/accounts/${username}/`);

  return processAccountData(data);
}

export async function patchProfile(username, params) {
  const processedParams = snakeCaseObject(params);

  const { data } = await getHttpClient()
    .patch(`${getSiteConfig().lmsBaseUrl}/api/user/v2/accounts/${username}/`, processedParams, {
      headers: {
        'Content-Type': 'application/merge-patch+json',
      },
    })
    .catch((error) => {
      processAndThrowError(error, processAccountErrors);
    });

  return processAccountData(data);
}

export async function postProfilePhoto(username, formData) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data } = await getHttpClient().post(
    `${getSiteConfig().lmsBaseUrl}/api/user/v2/accounts/${username}/profile_image/`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  ).catch((error) => {
    processAndThrowError(error, processPhotoErrors);
  });

  // TODO: Someday in the future the POST photo endpoint
  // will return the new values. At that time we should
  // use the commented line below instead of the separate
  // getAccount request that follows.
  // return camelCaseObject(data);
  const updatedData = await getAccount(username);
  return updatedData.profileImage;
}

export async function deleteProfilePhoto(username) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data } = await getHttpClient().delete(`${getSiteConfig().lmsBaseUrl}/api/user/v2/accounts/${username}/profile_image/`);

  // TODO: Someday in the future the POST photo endpoint
  // will return the new values. At that time we should
  // use the commented line below instead of the separate
  // getAccount request that follows.
  // return camelCaseObject(data);
  const updatedData = await getAccount(username);
  return updatedData.profileImage;
}

export async function getPreferences(username) {
  const { data } = await getHttpClient().get(`${getSiteConfig().lmsBaseUrl}/api/user/v2/accounts/${username}/preferences/`);

  return camelCaseObject(data);
}

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

  await getHttpClient().patch(`${getSiteConfig().lmsBaseUrl}/api/user/v2/accounts/${username}/preferences/`, processedParams, {
    headers: { 'Content-Type': 'application/merge-patch+json' },
  });

  return params; // TODO: Once the server returns the updated preferences object, return that.
}

function transformCertificateData(data) {
  const transformedData = [];
  data.forEach((cert) => {
    // download_url may be full url or absolute path.
    // note: using the URL() api breaks in ie 11
    const urlIsPath = typeof cert.download_url === 'string'
      && cert.download_url.search(/http[s]?:\/\//) !== 0;

    const downloadUrl = urlIsPath
      ? `${getSiteConfig().lmsBaseUrl}${cert.download_url}`
      : cert.download_url;

    transformedData.push({
      ...camelCaseObject(cert),
      certificateType: cert.certificate_type,
      downloadUrl,
    });
  });
  return transformedData;
}

export async function getCourseCertificates(username) {
  const url = `${getSiteConfig().lmsBaseUrl}/api/certificates/v0/certificates/${username}/`;
  try {
    const { data } = await getHttpClient().get(url);
    return transformCertificateData(data);
  } catch (e) {
    logError(e);
    return [];
  }
}

function extractCountryList(data) {
  return data?.fields
    .find(({ name }) => name === FIELD_LABELS.COUNTRY)
    ?.options?.map(({ value }) => (value)) || [];
}

export async function getCountryList() {
  const url = `${getSiteConfig().lmsBaseUrl}/api/user/v2/registrations/`;

  try {
    const { data } = await getHttpClient().get(url);
    return extractCountryList(data);
  } catch (e) {
    logError(e);
    return [];
  }
}
