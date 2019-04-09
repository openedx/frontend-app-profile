import LoggingService from '@edx/frontend-logging';

import { logEvent } from './analytics';
import { configuration } from '../config/environment';
import apiClient from '../config/apiClient';

jest.mock('@edx/frontend-logging');
jest.mock('../config/apiClient');

const eventType = 'test.event';
const eventData = {
  testShallow: 'test-shallow',
  testObject: {
    testDeep: 'test-deep',
  },
};


beforeAll(() => {
  apiClient.mockClear();
  LoggingService.mockClear();
});


describe('analytics logEvent', () => {
  it('posts expected data when successful', () => {
    jest.spyOn(apiClient, 'post').mockResolvedValue(undefined);

    expect.assertions(4);
    return logEvent(eventType, eventData)
      .then(() => {
        expect(apiClient.post.mock.calls.length).toEqual(1);
        expect(apiClient.post.mock.calls[0][0]).toEqual(`${configuration.LMS_BASE_URL}/event`);
        const data = 'event_type=test.event&event=%7B%22test_shallow%22%3A%22test-shallow%22%2C%22test_object%22%3A%7B%22test_deep%22%3A%22test-deep%22%7D%7D&page=http%3A%2F%2Flocalhost%2F';
        expect(apiClient.post.mock.calls[0][1]).toEqual(data);
        const config = apiClient.post.mock.calls[0][2];
        expect(config.headers['Content-Type']).toEqual('application/x-www-form-urlencoded');
      });
  });

  it('calls LoggingService.logAPIErrorResponse on error', () => {
    LoggingService.logAPIErrorResponse = jest.fn();
    jest.spyOn(apiClient, 'post').mockRejectedValue('test-error');

    expect.assertions(2);
    return logEvent(eventType, eventData)
      .then(() => {
        expect(LoggingService.logAPIErrorResponse.mock.calls.length).toBe(1);
        expect(LoggingService.logAPIErrorResponse.mock.calls[0][0]).toEqual('test-error');
      });
  });
});
