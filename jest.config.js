import { createConfig } from '@openedx/frontend-build';

export default createConfig('jest', {
  setupFilesAfterEnv: [
    '<rootDir>/src/setupTest.js',
  ],
});
