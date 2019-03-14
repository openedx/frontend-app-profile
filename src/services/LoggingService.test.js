import LoggingService from './LoggingService';

global.newrelic = {
  addPageAction: jest.fn(),
  noticeError: jest.fn(),
};

describe('logInfo', () => {
  it('calls New Relic client to log message if the client is available', () => {
    const message = 'Test log';
    LoggingService.logInfo(message);
    expect(global.newrelic.addPageAction).toHaveBeenCalledWith('INFO', { message });
  });
});

describe('logError', () => {
  it('calls New Relic client to log error if the client is available', () => {
    const error = new Error('Failed!');
    LoggingService.logError(error);
    expect(global.newrelic.noticeError).toHaveBeenCalledWith(error);
  });
});

describe('logAPIErrorResponse', () => {
  afterEach(() => {
    global.newrelic.noticeError.mockReset();
  });

  it('calls New Relic client to log error when error has request object', () => {
    const error = {
      request: {
        status: 400,
        responseURL: 'http://example.com',
        responseText: 'Very bad request',
      },
    };
    const message = `${error.request.status} ${error.request.responseURL} ${error.request.responseText}`;
    const expectedError = new Error(`API request failed: ${message}`);
    LoggingService.logAPIErrorResponse(error);
    expect(global.newrelic.noticeError).toHaveBeenCalledWith(expectedError);
  });

  it('calls New Relic client to log error when error has response object', () => {
    const error = {
      response: {
        status: 400,
        config: {
          url: 'http://example.com',
        },
        data: {
          detail: 'Very bad request',
        },
      },
    };
    const message = `${error.response.status} ${error.response.config.url} ${JSON.stringify(error.response.data)}`;
    const expectedError = new Error(`API request failed: ${message}`);
    LoggingService.logAPIErrorResponse(error);
    expect(global.newrelic.noticeError).toHaveBeenCalledWith(expectedError);
  });
});
