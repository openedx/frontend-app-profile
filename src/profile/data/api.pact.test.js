import path from 'path';
import { PactV3, MatchersV3 } from '@pact-foundation/pact';

import { getAccountRequest } from './services';
import { getConfig, initializeMockApp, setConfig } from '@edx/frontend-platform';

// Create a 'pact' between the two applications in the integration we are testing
const provider = new PactV3({
  log: path.resolve(process.cwd(), 'src/pact-logs/pact.log'),
  dir: path.resolve(process.cwd(), 'src/pacts'),
  consumer: 'frontend-app-profile',
  provider: 'edx-platform',
});

const getAccountBody = {
  "account_privacy":"private",
  "profile_image":{
    "has_image":false,
    "image_url_full":"http://localhost:18000/static/images/profiles/default_500.png",
    "image_url_large":"http://localhost:18000/static/images/profiles/default_120.png",
    "image_url_medium":"http://localhost:18000/static/images/profiles/default_50.png",
    "image_url_small":"http://localhost:18000/static/images/profiles/default_30.png"
  },"username":"edx",
  "bio":null,
  "course_certificates":null,
  "country":null,
  "date_joined":"2021-07-30T20:01:46Z",
  "language_proficiencies":[],
  "level_of_education":null,
  "social_links":[],
  "time_zone":null,
  "accomplishments_shared":false,
  "name":"",
  "email":"edx@example.com",
  "id":3,
  "verified_name":null,
  "extended_profile":[],
  "gender":null,
  "state":null,
  "goals":null,
  "is_active":true,
  "last_login":"2023-04-10T18:28:01.771896Z",
  "mailing_address":null,
  "requires_parental_consent":true,
  "secondary_email":null,
  "secondary_email_enabled":null,
  "year_of_birth":null,
  "phone_number":null,
  "activation_key":null,
  "pending_name_change":null
}

const EXPECTED_GET_ACCOUNT_BODY = MatchersV3.like(getAccountBody);

describe('getAccount', () => {
  beforeAll(async () => {
    initializeMockApp();
  });

  it('returns an HTTP 200 and user account information', () => {
    const username = 'edx';
    provider
      .given("I have user account information")
      .uponReceiving(`a request for a user's account information`)
      .withRequest({
        method: 'GET',
        path: `/api/user/v1/accounts/${username}`,
        headers: { Accept: 'application/json' },
      })
      .willRespondWith({
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: EXPECTED_GET_ACCOUNT_BODY
      });

    return provider.executeTest(async (mockserver) => {

      const port = mockserver.port;

      setConfig({
        ...getConfig(),
        LMS_BASE_URL: `http://localhost:${port}`,
      });

      const response = await getAccountRequest(username);

      expect(response.data).toEqual(getAccountBody);
    })
  });
});
