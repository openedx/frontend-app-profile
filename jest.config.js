const { createConfig } = require('@edx/frontend-build');

module.exports = createConfig('jest', {
  setupFiles: [
    '<rootDir>/src/setupTest.js',
  ],
});
