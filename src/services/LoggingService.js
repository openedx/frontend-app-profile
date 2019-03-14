/**
 * Logs info and errors to NewRelic and console.
 *
 * Requires the NewRelic Browser JavaScript snippet.
 */
class LoggingService {
  static logInfo(message) {
    if (typeof newrelic !== 'undefined') {
      newrelic.addPageAction('INFO', { message });
    }
  }

  static logError(error) {
    if (typeof newrelic !== 'undefined') {
      // Note: customProperties are not sent.  Presumably High-Security Mode is being used.
      newrelic.noticeError(error);
    }
  }

  // Note: will simply log errors that don't seem to be API error responses.
  static logAPIErrorResponse(error) {
    let processedError;
    if (error.response) {
      processedError = new Error(`API request failed: ${error.response.status} ${error.response.config.url} ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      processedError = new Error(`API request failed: ${error.request.status} ${error.request.responseURL} ${error.request.responseText}`);
    } else {
      processedError = Object.create(error);
    }
    if (processedError.message) {
      // NewRelic will not log the error if it is too long.
      processedError.message = processedError.message.substring(0, 4000);
    }
    this.logError(processedError);
  }
}

export default LoggingService;
