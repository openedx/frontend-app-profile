import snakecaseKeys from 'snakecase-keys';
import apiClient from '../config/apiClient';
import { configuration } from '../config/environment';

const eventLogApiBaseUrl = `${configuration.LMS_BASE_URL}/event`;

// Sends events to Segment and downstream
function handleTrackEvents(eventName, properties) {
  // Simply forward track events to Segment
  window.analytics.track(eventName, properties);
}


// Sends events to tracking log and downstream
// TODO: Determine consistent naming for eventName vs eventType and properties v eventData.
function logEvent(eventType, eventData) {
  snakecaseKeys(eventData, { deep: true });
  const serverData = {
    event_type: eventType,
    event: eventData,
    page: window.location.href,
  };
  // TODO: ARCH-430: Send errors to New Relic.
  return apiClient.post(eventLogApiBaseUrl, serverData);
}


function identifyUser() {
  const authState = apiClient.getAuthenticationState();
  if (authState.authentication && authState.authentication.userId) {
    // eslint-disable-next-line no-undef
    window.analytics.identify(authState.authentication.userId);
  }
}


export { handleTrackEvents, identifyUser, logEvent };
