
const fse = require('fs-extra');
const { execFile } = require('child_process');
const runSequence = require('run-sequence');

module.exports = (gulp, common, plugins) => {
  const { platforms, build: buildConfig } = common;
  const { distDir, targetDir, buildDir } = buildConfig;

  let execCommand = async (cmd, args, options) => {
    return new Promise((resolve, reject) => {
      execFile(cmd, args, options, (err, stdout, stderr) => {
        if (err) {
          console.log(stderr);

          reject(err);

          throw err;
        }

        console.log(stdout);

        resolve();
      });
    });
  };

  let installDependences = async (platform) => {
    return await execCommand(
      'npm',
      ['i', '--production', '--registry=https://registry.npm.taobao.org'],
      { cwd: platform.buildDir },
    );
  };

  let moveToBuild = async (platform) => {
    let { nodeDir, buildDir } = platform;

    console.log(`> Moving files ${platform.name} to build dir: ${buildDir}`);

    fse.ensureDirSync(`${buildDir}`);
    fse.ensureDirSync(`${targetDir}`);

    await fse.copy(`${distDir}`, `${buildDir}`);
    await fse.copy(`${nodeDir}`, `${buildDir}/node_modules/node`);

    await installDependences(platform);
  };

  let pack = async (platform) => {
    let { win, buildName, zipPath, tarPath } = platform;

    console.log(`> Packing ${platform.name} to target dir: ${targetDir}`);

    if (win) {
      await execCommand('zip', ['-rq', '-ll', zipPath, buildName], { cwd: buildDir });
    } else {
      const tarArguments = ['-zchf', tarPath, buildName];

      // Add a flag to handle filepaths with colons (i.e. C://...) on windows
      if (/^win/.test(process.platform)) {
        tarArguments.push('--force-local');
      }

      await execCommand('tar', tarArguments, { cwd: buildDir });
    }
  };

  gulp.task('pack:copy', () => {
    let platformPromises = platforms.map((platform) => {
      return moveToBuild(platform);
    });

    return Promise.all(platformPromises);
  });

  gulp.task('pack:package', () => {
    let platformPromises = platforms.map((platform) => {
      return pack(platform);
    });

    return Promise.all(platformPromises);
  });

  /**
   * 打包项目
   */
  gulp.task('pack', (cb) => {
    runSequence('pack:copy', 'pack:package', cb);
  });
};
