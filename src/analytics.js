const handleTrackEvents = (eventName, properties) => {
  // Simply forward track events to Segment
  window.analytics.track(eventName, properties);
};

export { handleTrackEvents }; // eslint-disable-line import/prefer-default-export
