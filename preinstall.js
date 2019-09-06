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

const packageJSON = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const dependencies = packageJSON.dependencies;
const dynamicDependencies = Object.entries(dependencies)
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

dynamicDependencies.forEach(({ alias, target }) => {
  const configuredTarget = getPackageTargetFromConfiguration({ alias, target });
  packageJSON.dependencies[alias] = configuredTarget;
  console.log(`Resolved dynamic dependency ${alias} to: ${configuredTarget}.`);
})

fs.writeFileSync('package.json', JSON.stringify(packageJSON, null, 2));



