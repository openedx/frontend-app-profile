const config = {
  // Override default .env.development values
  ACCESS_TOKEN_COOKIE_NAME: 'stage-edx-jwt-cookie-header-payload',
  CREDENTIALS_BASE_URL: 'https://credentials.stage.edx.org',
  LMS_BASE_URL: 'https://courses.stage.edx.org',
  LOGIN_URL: 'https://courses.stage.edx.org/login',
  LOGOUT_URL: 'https://courses.stage.edx.org/logout',
  MARKETING_SITE_BASE_URL: 'https://stage.edx.org',
  ORDER_HISTORY_URL: 'https://orders.stage.edx.org/orders',
  ENTERPRISE_LEARNER_PORTAL_HOSTNAME: 'enterprise.stage.edx.org',
  REFRESH_ACCESS_TOKEN_ENDPOINT: 'https://courses.stage.edx.org/login_refresh',
  // Paragon theme URLs
  PARAGON_THEME_URLS: {
    core: 'https://cdn.jsdelivr.net/npm/@edx/paragon@$paragonVersion/dist/core.min.css',
    variants: {
      light: {
        url: 'https://cdn.jsdelivr.net/npm/@edx/paragon@$paragonVersion/dist/light.min.css',
        default: true,
        dark: false,
      },
    },
  },
};

export default config;
