import { logEvent } from './analytics';
import { configuration } from '../config/environment';
import LoggingService from '../services/LoggingService';
import apiClient from '../config/apiClient';

jest.mock('../services/LoggingService');
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

    expect.assertions(3);
    return logEvent(eventType, eventData)
      .then(() => {
        expect(apiClient.post.mock.calls.length).toEqual(1);
        expect(apiClient.post.mock.calls[0][0]).toEqual(`${configuration.LMS_BASE_URL}/event`);
        expect(apiClient.post.mock.calls[0][1]).toEqual({
          event_type: 'test.event',
          event: '{"test_shallow":"test-shallow","test_object":{"test_deep":"test-deep"}}',
          page: window.location.href,
        });
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
