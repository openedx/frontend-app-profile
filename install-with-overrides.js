// This script is designed to be run at npm preinstall
// it will swap @edx-dynamic/* packages with packages
// supplied in environment config variables in the form
// of process.env.EDX_DYNAMIC_*
//
// @edx-dynamic/* packages in package.json are aliases
// and are defined with their default target. See this
// pull request for more detail on npm aliases:
// https://github.com/npm/cli/pull/3

const fs = require('fs');
const pkg = require('./package.json');
const { exec, execSync } = require("child_process");

const dynamicDependencies = Object.entries(pkg.dependencies)
  .filter(([name, version]) => name.includes('@edx-dynamic/'))
  .map(([alias, target]) => ({ alias, target }));

const getEnvKeyFromAlias = (alias) => {
  return alias
    .replace(/[^a-z]/g, '_') // swap all non a-z characters to _
    .replace(/^\_+/g, '') // trim first _ if exists
    .toUpperCase();
}

console.log("Performing default install followed by dynamic dependency overrides.");

const firstInstallProcess = exec('npm install', { env: process.env }, () => {
  // Install overrides
  const installTargets = dynamicDependencies
    .filter(({ alias }) => process.env.hasOwnProperty(getEnvKeyFromAlias(alias)))
    .map(({ alias }) => {
      const target = process.env[getEnvKeyFromAlias(alias)];
      console.log(`Resolved dynamic dependency ${alias} to: ${target}.`);
      return `${alias}@${target}`;
    })
    .join(' ');

  if (installTargets.length === 0) {
    return;
  }

  const secondInstallProcess = exec(`npm install ${installTargets}`);
  secondInstallProcess.stdout.pipe(process.stdout);
  secondInstallProcess.stderr.pipe(process.stderr);
});

firstInstallProcess.stdout.pipe(process.stdout);
firstInstallProcess.stderr.pipe(process.stderr);
