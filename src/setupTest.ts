import '@testing-library/jest-dom';

import { addAppConfigs, initializeMockApp } from '@openedx/frontend-base';

// Merges `site.config.test.tsx` into the site config, configures mock logging, auth and analytics
// services and the real i18n service, and signs in a user, as the legacy test setup did.
initializeMockApp({
  authenticatedUser: {
    userId: 123,
    username: 'staff',
    name: 'Staff User',
    email: 'staff@example.com',
    roles: [],
    administrator: false,
  },
});
addAppConfigs();
