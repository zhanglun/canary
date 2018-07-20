const { basename, dirname, resolve, relative } = require('path');
const { platform: getOsPlatform, release } = require('os');
const download = require('download');
const signale = require('signale');

function getNodeDownloadInfo(config, platform) {
  const version = config.getNodeVersion();
  const arch = platform.getNodeArch();

  const downloadName = platform.isWindows()
    ? 'win-x64/node.exe'
    : `node-v${version}-${arch}.tar.gz`;

  const url = `https://npm.taobao.org/mirrors/node/v${version}/${downloadName}`;
  const downloadPath = config.resolveFromRepo('.node_binaries', version, basename(downloadName));
  const extractDir = config.resolveFromRepo('.node_binaries', version, arch);

  return {
    url,
    downloadName,
    downloadPath,
    extractDir,
  };
}

function startDownload(url, path, platform) {
  signale.pending('Start download node %s', platform.getName());

  return download(url, path)
    .then(() => {
      signale.success('Downloaded! %s', platform.getName());
    });
}

module.exports = async (gulp, config, plugins) => {
  gulp.task('download', (cb) => {
    config.getPlatforms().map(async (platform) => {
      const { url, downloadPath, downloadName } = await getNodeDownloadInfo(config, platform)

      const result = await startDownload(url, downloadPath, platform);
    })
  });
};

