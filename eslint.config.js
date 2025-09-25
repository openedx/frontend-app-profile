// @ts-check

const { createLintConfig } = require('@openedx/frontend-base/config');

module.exports = createLintConfig(
  {
    files: [
      'src/**/*',
      'site.config.*',
    ],
  },
  {
    ignores: [
      'coverage/*',
      'dist/*',
      'node_modules/*',
      '**/__mocks__/*',
      '**/__snapshots__/*',
    ],
  },
);