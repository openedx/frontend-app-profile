import apiClient from './data/apiClient';

const handleTrackEvents = (eventName, properties) => {
  // Simply forward track events to Segment
  window.analytics.track(eventName, properties);
};


const identifyUser = () => {
  const authState = apiClient.getAuthenticationState();
  if (authState.authentication && authState.authentication.userId) {
    // eslint-disable-next-line no-undef
    window.analytics.identify(authState.authentication.userId);
  }
};

export { handleTrackEvents, identifyUser };
