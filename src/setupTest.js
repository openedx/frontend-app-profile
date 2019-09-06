/* eslint-disable import/no-extraneous-dependencies */

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import App from '../frontend-core/App';

Enzyme.configure({ adapter: new Adapter() });

// These configuration values are usually set in webpack's EnvironmentPlugin however
// Jest does not use webpack so we need to set these so for testing
process.env.LMS_BASE_URL = 'http://localhost:18000';
process.env.LANGUAGE_PREFERENCE_COOKIE_NAME = 'language-cookie';
process.env.VIEW_MY_RECORDS_URL = 'http://localhost:18150/records';
process.env.ACCOUNT_SETTINGS_URL = 'http://localhost:1997';

App.config = {
  LMS_BASE_URL: process.env.LMS_BASE_URL,
  LANGUAGE_PREFERENCE_COOKIE_NAME: process.env.LANGUAGE_PREFERENCE_COOKIE_NAME,
  VIEW_MY_RECORDS_URL: process.env.VIEW_MY_RECORDS_URL,
  ACCOUNT_SETTINGS_URL: process.env.ACCOUNT_SETTINGS_URL,
};
