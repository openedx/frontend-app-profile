/* eslint-disable import/no-extraneous-dependencies */
import { App } from '@edx/frontend-base';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

// These configuration values are usually set in webpack's EnvironmentPlugin however
// Jest does not use webpack so we need to set these so for testing
process.env.LMS_BASE_URL = 'http://localhost:18000';
process.env.LANGUAGE_PREFERENCE_COOKIE_NAME = 'language-cookie';
process.env.CREDENTIALS_BASE_URL = 'http://localhost:18150';

App.config = {
  LMS_BASE_URL: process.env.LMS_BASE_URL,
  LANGUAGE_PREFERENCE_COOKIE_NAME: process.env.LANGUAGE_PREFERENCE_COOKIE_NAME,
  CREDENTIALS_BASE_URL: process.env.CREDENTIALS_BASE_URL,
};
