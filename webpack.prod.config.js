const glob = require('glob');
const PurgecssPlugin = require('purgecss-webpack-plugin');
const NewRelicSourceMapPlugin = require('new-relic-source-map-webpack-plugin');

const { createConfig } = require('@edx/frontend-build');

module.exports = createConfig('webpack-prod', {
  plugins: [
    // Scan files for class names and ids and remove unused css
    new PurgecssPlugin({
      paths: [].concat(
        // Scan files in this app
        glob.sync('src/**/*', { nodir: true }),
        // Scan files in any edx frontend-component
        glob.sync('node_modules/@edx/frontend-component*/**/*', { nodir: true }),
        // Scan files in paragon
        glob.sync('node_modules/@edx/paragon/**/*', { nodir: true }),
      ),
      // Protect react-css-transition class names
      whitelistPatterns: [/-enter/, /-appear/, /-exit/],
    }),
    new NewRelicSourceMapPlugin({
      applicationId: process.env.NEW_RELIC_APP_ID,
      nrAdminKey: process.env.NEW_RELIC_ADMIN_KEY,
      staticAssetUrl: process.env.BASE_URL,
      noop: typeof process.env.NEW_RELIC_ADMIN_KEY === 'undefined', // upload source maps in prod builds only
    }),
  ],
});
