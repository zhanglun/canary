const { resolve } = require('path');
const buildConfig = require('./build')();

module.exports = function () {
  const { version } = buildConfig;
  const nodeVersion = buildConfig.pkg.nodeVersion;
  const rootPath = buildConfig.root;
  const projectName = buildConfig.pkg.name;
  const baseUri = `https://nodejs.org/dist/v${nodeVersion}`;

  return [
    // 'darwin-x64',
    'linux-x64',
    // 'linux-x86',
    // 'win-x64',
    // 'win-x86',
  ].map(function (baseName) {
    const win = baseName.indexOf('win') == 0;

    const nodeUrl = win ? `${baseUri}/node-v${nodeVersion}-${baseName}.zip` : `${baseUri}/node-v${nodeVersion}-${baseName}.tar.gz`;
    const nodeDir = resolve(rootPath, `.node_binaries/${nodeVersion}/${baseName}`);

    const name = baseName;

    const nodeShaSums = `${baseUri}/SHASUMS256.txt`;

    const buildName = `${projectName}-${version}-${name}`;
    // const buildName = `${projectName}`;
    const buildDir = resolve(buildConfig.buildDir, buildName);

    const tarName = `${buildName}.tar.gz`;
    const tarPath = resolve(buildConfig.targetDir, tarName);

    const zipName = `${buildName}.zip`;
    const zipPath = resolve(buildConfig.targetDir, zipName);

    let debName;
    let debPath;
    let rpmName;
    let rpmPath;
    let debArch;
    let rpmArch;

    if (name.match('linux')) {
      debArch = 'amd64';
      debName = `${projectName}-${version}-${debArch}.deb`;
      debPath = resolve(buildConfig.targetDir, debName);

      rpmArch = 'x86_64';
      rpmName = `${projectName}-${version}-${rpmArch}.rpm`;
      rpmPath = resolve(buildConfig.targetDir, rpmName);
    }

    return {
      name,
      win,

      nodeUrl,
      nodeDir,
      nodeShaSums,

      buildName,
      buildDir,
      tarName,
      tarPath,
      zipName,
      zipPath,
      debName,
      debPath,
      debArch,
      rpmName,
      rpmPath,
      rpmArch,
    };
  });
};
