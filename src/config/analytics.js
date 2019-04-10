import { configureAnalytics, initializeSegment } from '@edx/frontend-analytics';
import LoggingService from '@edx/frontend-logging';

import apiClient from '../config/apiClient';
import { configuration } from '../config/environment';

initializeSegment(configuration.SEGMENT_KEY);
configureAnalytics({
  loggingService: LoggingService,
  authApiClient: apiClient,
  analyticsApiBaseUrl: configuration.LMS_BASE_URL,
});
