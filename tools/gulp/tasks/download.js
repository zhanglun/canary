const download = require('download');
const gulp = require('gulp');

const ROOT = process.cwd;

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

function startDownload(url, path) {
  return download(NODE_URL, NODE_PATH);
}

module.exports = async (gulp, config, plugins) => {
  console.log('adfasdf config', config);

  gulp.task('download:node', async (cb) => {
    config.getPlatforms().map(async (platform) => {
      const { url, downloadPath, downloadName } = await getNodeDownloadInfo(config, platform)

      await startDownload(url, downloadPath);
    })
  });
};
