import apiClient from '../config/apiClient';
import { configuration } from '../config/environment';
import { snakeCaseObject } from '../services/utils';
import LoggingService from '../services/LoggingService';

const eventLogApiBaseUrl = `${configuration.LMS_BASE_URL}/event`;

// Sends events to Segment and downstream
function handleTrackEvents(eventName, properties) {
  // Simply forward track events to Segment
  window.analytics.track(eventName, properties);
}


// Sends events to tracking log and downstream
// TODO: Determine consistent naming for eventName vs eventType and properties v eventData.
function logEvent(eventType, eventData) {
  const snakeEventData = snakeCaseObject(eventData, { deep: true });
  const serverData = {
    event_type: eventType,
    event: snakeEventData,
    page: window.location.href,
  };
  return apiClient.post(eventLogApiBaseUrl, serverData)
    .catch((error) => {
      LoggingService.logAPIErrorResponse(error);
    });
}


function identifyUser() {
  const authState = apiClient.getAuthenticationState();
  if (authState.authentication && authState.authentication.userId) {
    // eslint-disable-next-line no-undef
    window.analytics.identify(authState.authentication.userId);
  }
}


export { handleTrackEvents, identifyUser, logEvent };
