// This test file simply creates a contract that defines
// expectations and correct responses from the Pact stub server.

import path from 'path';

import { PactV3, MatchersV3 } from '@pact-foundation/pact';

import { initializeMockApp, getConfig, setConfig } from '@edx/frontend-platform';
import { getAccount } from './services';

const expectedUserInfo200 = {
  username: 'staff',
  email: 'staff@example.com',
  bio: 'This is my bio',
  name: 'Lemon Seltzer',
  country: 'ME',
  dateJoined: '2017-06-07T00:44:23Z',
  isActive: true,
  yearOfBirth: 1901,
};

const provider = new PactV3({
  log: path.resolve(process.cwd(), 'src/pact-logs/pact.log'),
  dir: path.resolve(process.cwd(), 'src/pacts'),
  consumer: 'frontend-app-profile',
  provider: 'edx-platform',
});

describe('getAccount for one username', () => {
  beforeAll(async () => {
    initializeMockApp();
  });
  it('returns a HTTP 200 and user information', async () => {
    const username200 = 'staff';
    await provider.addInteraction({
      states: [{ description: "I have a user's basic information" }],
      uponReceiving: "A request for user's basic information",
      withRequest: {
        method: 'GET',
        path: `/api/user/v1/accounts/${username200}`,
        headers: {},
      },
      willRespondWith: {
        status: 200,
        headers: {},
        body: MatchersV3.like(expectedUserInfo200),
      },
    });
    return provider.executeTest(async (mockserver) => {
      setConfig({
        ...getConfig(),
        LMS_BASE_URL: mockserver.url,
      });
      const response = await getAccount(username200);
      expect(response).toEqual(expectedUserInfo200);
    });
  });

  it('Account does not exist', async () => {
    const username404 = 'staff_not_found';
    await provider.addInteraction({
      states: [{ description: "Account and user's information does not exist" }],
      uponReceiving: "A request for user's basic information",
      withRequest: {
        method: 'GET',
        path: `/api/user/v1/accounts/${username404}`,
      },
      willRespondWith: {
        status: 404,
      },
    });
    await provider.executeTest(async (mockserver) => {
      setConfig({
        ...getConfig(),
        LMS_BASE_URL: mockserver.url,
      });
      await expect(getAccount(username404).then((response) => response.data)).rejects.toThrow('Request failed with status code 404');
    });
  });
});
