export const configuration = {
  BASE_URL: process.env.BASE_URL,
  LMS_BASE_URL: process.env.LMS_BASE_URL,
  LOGIN_URL: process.env.LOGIN_URL,
  ACCOUNT_SETTINGS_URL: `${process.env.LMS_BASE_URL}/account/settings`,
  LOGOUT_URL: process.env.LOGOUT_URL,
  CSRF_TOKEN_API_PATH: process.env.CSRF_TOKEN_API_PATH,
  REFRESH_ACCESS_TOKEN_ENDPOINT: process.env.REFRESH_ACCESS_TOKEN_ENDPOINT,
  DATA_API_BASE_URL: process.env.DATA_API_BASE_URL,
  SECURE_COOKIES: process.env.NODE_ENV !== 'development',
  SEGMENT_KEY: process.env.SEGMENT_KEY,
  ACCESS_TOKEN_COOKIE_NAME: process.env.ACCESS_TOKEN_COOKIE_NAME,
  USER_INFO_COOKIE_NAME: process.env.USER_INFO_COOKIE_NAME,
  CSRF_COOKIE_NAME: process.env.CSRF_COOKIE_NAME,
  ENVIRONMENT: process.env.NODE_ENV,
  ACCOUNTS_API_BASE_URL: `${process.env.LMS_BASE_URL}/api/user/v1/accounts`,
  PREFERENCES_API_BASE_URL: `${process.env.LMS_BASE_URL}/api/user/v1/preferences`,
  CERTIFICATES_API_BASE_URL: `${process.env.LMS_BASE_URL}/api/certificates/v0/certificates`,
  VIEW_MY_RECORDS_URL: `${process.env.CREDENTIALS_BASE_URL}/records`,
};

export const features = {};
