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

const getPackageTargetFromConfiguration = ({ alias, target: defaultTarget }) => {
  // Tranform alias into the form: EDX_DYNAMIC_MODULE_NAME
  const envKey = alias
    .replace(/[^a-z]/g, '_') // swap all non a-z characters to _
    .replace(/^\_+/g, '') // trim first _ if exists
    .toUpperCase();

  if (process.env[envKey]) {
    return process.env[envKey];
  }

  return defaultTarget;
}

console.log("Preinstall: Add dynamic dependencies to package.json");

const renameSyncExists = (filename, newFilename) => {
  if (fs.existsSync(filename)) {
    fs.renameSync(filename, newFilename);
  }
}
const unlinkSyncExists = (filename) => {
  if (fs.existsSync(filename)) {
    fs.unlinkSync(filename);
  }
}
const protectOriginals = () => {
  renameSyncExists('package.json', 'package.orig.json');
  renameSyncExists('package-lock.json', 'package-lock.orig.json');
}
const restoreOriginals = () => {
  unlinkSyncExists('package.json');
  unlinkSyncExists('package-lock.json');
  renameSyncExists('package.orig.json', 'package.json');
  renameSyncExists('package-lock.orig.json', 'package-lock.json');
}

dynamicDependencies.forEach(({ alias, target }) => {
  const configuredTarget = getPackageTargetFromConfiguration({ alias, target });
  pkg.dependencies[alias] = configuredTarget;
  console.log(`Resolved dynamic dependency ${alias} to: ${configuredTarget}.`);
})

protectOriginals();
process.on('beforeExit', (code) => {
  restoreOriginals();
});

fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
const childProcess = exec('npm install', { env: process.env });
childProcess.stdout.pipe(process.stdout);
childProcess.stderr.pipe(process.stderr);
