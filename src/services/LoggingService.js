/**
 * Logs info and errors to NewRelic and console.
 *
 * Requires the NewRelic Browser JavaScript snippet.
 */

// NewRelic will not log an error if it is too long.
const MAX_ERROR_LENGTH = 4000;

function fixErrorLength(error) {
  if (error.message && error.message.length > MAX_ERROR_LENGTH) {
    const processedError = Object.create(error);
    processedError.message = processedError.message.substring(0, MAX_ERROR_LENGTH);
    return processedError;
  } else if (typeof error === 'string' && error.length > MAX_ERROR_LENGTH) {
    return error.substring(0, MAX_ERROR_LENGTH);
  }
  return error;
}

class LoggingService {
  static logInfo(message) {
    if (typeof newrelic !== 'undefined') {
      newrelic.addPageAction('INFO', { message });
    }
  }

  static logError(error, customAttributes) {
    if (typeof newrelic !== 'undefined') {
      // Note: customProperties are not sent.  Presumably High-Security Mode is being used.
      newrelic.noticeError(fixErrorLength(error), customAttributes);
    }
  }

  // API errors look for axios API error format.
  // Note: function will simply log errors that don't seem to be API error responses.
  static logAPIErrorResponse(error, customAttributes) {
    let processedError = error;
    let updatedCustomAttributes = customAttributes;

    if (error.response) {
      let data = !error.response.data ? '' : JSON.stringify(error.response.data);
      // Don't include data if it is just an HTML document, like a 500 error page.
      data = data.includes('<!DOCTYPE html>') ? '' : data;
      const responseAttributes = {
        errorType: 'api-response-error',
        errorStatus: error.response.status,
        errorUrl: error.response.config ? error.response.config.url : '',
        errorData: data,
      };
      updatedCustomAttributes = Object.assign({}, responseAttributes, customAttributes);
      processedError = new Error(`API request failed: ${error.response.status} ${responseAttributes.errorUrl} ${data}`);
    } else if (error.request) {
      const { request } = error;
      const errorMessage = request.responseText || error.message;
      const requestAttributes = {
        errorType: 'api-request-error',
        errorStatus: request.status,
        errorUrl: request.responseURL,
        errorData: errorMessage,
      };
      updatedCustomAttributes = Object.assign({}, requestAttributes, customAttributes);
      processedError = new Error(`API request failed: ${request.status} ${request.responseURL} ${errorMessage} ${JSON.stringify(error)}`);
    }

    this.logError(processedError, updatedCustomAttributes);
  }
}

export default LoggingService;
export { MAX_ERROR_LENGTH };
