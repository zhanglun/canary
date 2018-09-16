const path = require('path');
const { execSync } = require('child_process');
const platform = require('os').platform();
const pkg = require('../../../package.json');
const root = path.resolve(__dirname, '../../../');

let buildVersion = (isRelease, version) => {
  return isRelease ? version : `${version}-SNAPSHOT`;
}

module.exports = () => {
  const pkgVersion = pkg.version;
  const sha = String(execSync('git rev-parse HEAD')).trim();
  const version = pkgVersion;

  let number;

  if (/^win/.test(platform)) {
    // Windows does not have the wc process and `find /C /V ""` does not consistently work
    number = String(execSync('git log --format="%h"')).split('\n').length;
  } else {
    number = parseFloat(String(execSync('git log --format="%h" | wc -l')).trim());
  }

  return {
    sha,
    pkg,
    number,
    version,

    root,
    distDir: path.resolve(root, 'dist'), // 项目打包目录
    buildDir: path.resolve(root, 'build'), // 不同操作系统的打包代码
    clientDir: path.resolve(root, 'client'), // 前端代码
    serverDir: path.resolve(root, 'server'), // node 端代码
    targetDir: path.resolve(root, 'target'), // 最终的压缩包目录
    buildVersion: buildVersion(),
  };
};
