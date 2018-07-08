const { basename, dirname, resolve, relative } = require('path');
const { platform: getOsPlatform, release } = require('os');

function createPlatform(name) {
  return new class Platform {
    getName() {
      return name;
    }

    getNodeArch() {
      return `${name}-x64`;
    }

    getBuildName() {
      return `${name}-x86_64`;
    }

    isWindows() {
      return name === 'windows';
    }

    isMac() {
      return name === 'darwin';
    }

    isLinux() {
      return name === 'linux';
    }
  };
}

module.exports = (function (args) {
	const root = process.cwd();
  const pkgPath = resolve(__dirname, '../../package.json');
  const pkg = require(pkgPath);
  const repoRoot = dirname(pkgPath);
  const nodeVersion = pkg.engines.node;
  const releaseVersion = pkg.version;
  const clientPath = resolve(__dirname, '../../client');
  const serverPath = resolve(__dirname, '../../server');


  const platforms = ['darwin', 'linux', 'windows'].map(createPlatform);

  let config = {
    root,
    pkg,
    repoRoot,
    nodeVersion,
    releaseVersion,
    clientPath,
    serverPath,

    platforms,
  };

  let configFns = {
    getPlatforms() {
      return platforms;
    },

    getNodeVersion() {
      return nodeVersion;
    },

    resolveFromRepo(...subPaths) {
      return resolve(repoRoot, ...subPaths);
    },

    getVersionInfo: async function ({ isRelease, pkg }) {
      return {
        buildSha: await exec.stdout('git', ['rev-parse', 'HEAD']),
        buildVersion: isRelease ? pkg.version : `${pkg.version}-SNAPSHOT`,
        buildNumber: await getBuildNumber(),
      };
    }
  };

  config = Object.assign({}, config, configFns);

  return config;
})();
