/* eslint-disable no-console */

// This script is a replacement for npm install it
// will install normally and then install overrides
// for aliased @edx-dynamic/* packages using environment
// variables in the form of process.env.EDX_DYNAMIC_*
//
// @edx-dynamic/* packages in package.json are aliases
// and are defined with their default target. See this
// pull request for more detail on npm aliases:
// https://github.com/npm/cli/pull/3

const pkg = require('./package.json');
const { spawn } = require('child_process');


const getPackageTargetForAlias = (alias) => {
  // Key's should be in SCREAMING_SNAKE_CASE: process.env.EDX_DYNAMIC_*
  const aliasEnvKey = alias
    .replace(/[^a-z]/g, '_') // swap all non a-z characters to _
    .replace(/^_+/g, '') // trim first _ if exists
    .toUpperCase();

  // TODO: Should we sanitize this input?
  return process.env[aliasEnvKey];
};

const packageOverrides = Object.keys(pkg.dependencies)
  // Only scan for overridden packages named @edx-dynamic/*
  .filter(packageName => packageName.includes('@edx-dynamic/'))

  // Get package targets for alias from process.env
  .map(packageName => ({
    alias: packageName,
    overrideTarget: getPackageTargetForAlias(packageName),
  }))

  // Remove aliases that haven't been defined
  .filter(({ overrideTarget }) => overrideTarget !== undefined)

  // Prepare override installs for command line install
  .map(({ alias, overrideTarget }) => {
    console.log(`Resolved dynamic dependency ${alias} to: ${overrideTarget}.`);
    return `${alias}@${overrideTarget}`;
  })
  .join(' ');


console.log('Install with defaults...');

spawn('npm install', { stdio: 'inherit', shell: true }, () => {
  console.log('Install with overrides...');

  spawn(`npm install ${packageOverrides}`, { stdio: 'inherit', shell: true });
});
