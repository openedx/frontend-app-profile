import { isClientError, retryUnlessClientError } from './queryOptions';

describe('isClientError', () => {
  it('is true for a 4xx response', () => {
    expect(isClientError({ response: { status: 404 } })).toBe(true);
    expect(isClientError({ response: { status: 403 } })).toBe(true);
  });

  it('is false for anything else', () => {
    expect(isClientError({ response: { status: 500 } })).toBe(false);
    expect(isClientError(new Error('network'))).toBe(false);
    expect(isClientError(undefined)).toBe(false);
  });
});

describe('retryUnlessClientError', () => {
  it('does not retry a 4xx', () => {
    expect(retryUnlessClientError(0, { response: { status: 404 } })).toBe(false);
  });

  it('retries anything else three times', () => {
    const error = { response: { status: 502 } };
    expect(retryUnlessClientError(0, error)).toBe(true);
    expect(retryUnlessClientError(2, error)).toBe(true);
    expect(retryUnlessClientError(3, error)).toBe(false);
  });
});
