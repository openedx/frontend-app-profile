// This test file simply creates a contract that defines
// expectations and correct responses from the Pact stub server.

import path from 'path';

import { PactV3, MatchersV3 } from '@pact-foundation/pact';

import { initializeMockApp, getConfig, setConfig } from '@edx/frontend-platform';
import { getAccount } from './services';

const expectedUserInfo200 = {
  bio: 'This is my bio',
  country: 'ME',
  gender: 'm',
  goals: 'Learn and Grow!',
  isActive: true,
  mailingAddress: 'Park Ave',
  name: 'Lemon Seltzer',
  phoneNumber: '+11234567890',
  username: 'staff',
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
});
