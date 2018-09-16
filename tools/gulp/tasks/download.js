
const path = require('path');
const util = require('util');
const fs = require('fs');
const fse = require('fs-extra');
const { createGunzip } = require('zlib');
const exec = require('child_process').exec;
const tar = require('tar');
const { fromFile } = require('check-hash');
const download = require('download');
const wreck = require('wreck');

const writeFileAsync = util.promisify(fs.writeFile);
const checkHashFromFile = fromFile;

module.exports = function downloadNodeBuilds(gulp, common, plugins) {
  const { platforms, build: buildConfig } = common;
  const downloadLimit = Object.keys(platforms).length;

  const shaSums = {};

  /**
   * 获取sha
   * @return {[type]} [description]
   */
  const getShaSums = () => {
    const nodeVersion = buildConfig.pkg.nodeVersion;
    const shaSumsUri = `https://nodejs.org/dist/v${nodeVersion}/SHASUMS256.txt`;

    console.log('start get SHASUMS256.txt');

    return wreck
      .request('GET', shaSumsUri)
      .then(res => {
        if (res.statusCode !== 200) {
          throw new Error(
            `${shaSumsUri} failed with a ${res.statusCode} response`,
          );
        }

        return wreck.read(res);
      })
      .then(payload => {
        payload
          .toString('utf8')
          .split('\n')
          .forEach(line => {
            const [sha, platform] = line.split('  ');

            shaSums[platform] = sha;
          });

        console.log('finished get SHASUMS256.txt');

        return Promise.resolve(shaSums);
      });
  };

  /**
   * 比对sha
   * @param {Object} platform
   */
  const checkShaSum = (platform) => {
    const file = path.basename(platform.nodeUrl);
    const downloadDir = path.join(platform.nodeDir, '..');
    const filePath = path.resolve(downloadDir, file);
    const expected = {
      hash: 'sha256',
      expected: platform.win ? shaSums[path.basename(path.dirname(platform.nodeUrl)) + '/' + file] : shaSums[file],
    };

    if (!fs.existsSync(filePath)) {
      return false;
    }

    return new Promise((resolve, reject) => {
      checkHashFromFile(filePath, expected, (err, passed, actual) => {
        if (err) {
          reject(err);
        }

        if (!passed) {
          reject(passed, actual);
        }

        return resolve(passed, actual);
      });
    });
  };

  /**
   * 下载不同平台的Node
   */
  const downloadNodeBuilds = async(platform) => {
    const downloadDir = path.join(platform.nodeDir, '..');
    const file = path.basename(platform.nodeUrl);
    const filePath = path.resolve(downloadDir, file);

    console.log(`> Starting download ${file}`);

    return download(platform.nodeUrl)
      .then((file) => {
        console.log('filePath--->', filePath);
        return writeFileAsync(filePath, file);
      });
  };

  const startDownload = async platform => {
    const downloadDir = path.join(platform.nodeDir, '..');

    let downloadCounter = 0;
    let isDownloadValid = false;

    console.log(common.argv);

    if (common.argv.skipDownloadNode) {
      return;
    }
    // while (!isDownloadValid && downloadCounter < downloadLimit) {
    //   await downloadNodeBuilds(platform);
    //   ++downloadCounter;
    // }

    await downloadNodeBuilds(platform);

    if (!isDownloadValid) {
      return `${platform.name} download failed`;
    }

    console.log(`${platform.name} downloaded and verified`);
  };

  /**
   * 解压Node
   */
  const extractNodeBuild = async(platform) => {
    let { nodeDir, nodeUrl, win } = platform;
    const file = path.basename(nodeUrl);
    const downloadDir = path.join(nodeDir, '..');
    const filePath = path.resolve(downloadDir, file);

    return new Promise((resolve, reject) => {
      if (win) {
        let command = `unzip -d ${nodeDir} ${filePath}
          mv ${path.resolve(nodeDir, file.replace(/\.zip$/, ''))}/* ${nodeDir}
          rm -rf ${path.resolve(nodeDir, file.replace(/\.zip$/, ''))}`;

        exec(command, {maxBuffer: 1024 * 10000}, (err) => {
          if (err) {
            reject(err);
          }

          resolve();
        });
      } else {
        fs.createReadStream(filePath)
          .pipe(createGunzip())
          .on('error', reject)
          .pipe(tar.x({ C: platform.nodeDir, strip: 1 }))
          .on('error', reject)
          .on('end', resolve);
      }
    });
  };

  const extract = async platform => {
    if (!common.argv.skipDownloadNode && fs.existsSync(platform.nodeDir)) {
      fse.removeSync(platform.nodeDir);
    }

    fse.mkdirpSync(platform.nodeDir);

    await extractNodeBuild(platform);
  };

  gulp.task('build:downloadNode', function() {
    console.log('> Starting Downloading Nodes for platforms...');

    fse.mkdirpSync(path.join(platforms[0].nodeDir, '..'));

    let platformPromises = platforms.map(platform => {
      return startDownload(platform);
    });

    return getShaSums()
      .then(() => {
        return Promise.all(platformPromises);
      }).catch((values) => {
        console.log('---->', values);
      });
  });

  gulp.task('build:extractNode', function() {
    console.log('> Starting extract Nodes for platforms...');

    let platformPromises = platforms.map(platform => {
      return extract(platform);
    });

    return Promise.all(platformPromises);
  });
};
