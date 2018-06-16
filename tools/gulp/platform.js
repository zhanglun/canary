import { basename, dirname, resolve, relative } from 'path';
import { platform as getOsPlatform } from 'os';

function getNodeDownloadInfo(config, platform) {
  const version = config.getNodeVersion();
  const arch = platform.getNodeArch();

  const downloadName = platform.isWindows()
    ? 'win-x64/node.exe'
    : `node-v${version}-${arch}.tar.gz`;

  const downloadUrl = `https://npm.taobao.org/mirrors/node/v${version}/${downloadName}`;
  const downloadPath = config.resolveFromRepo('.node_binaries', version, basename(downloadName));
  const extractDir = config.resolveFromRepo('.node_binaries', version, arch);

  return {
    downloadUrl,
    downloadName,
    downloadPath,
    extractDir,
  };
}

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

async function getBuildNumber() {
  if (/^win/.test(os.platform())) {
    // Windows does not have the wc process and `find /C /V ""` does not consistently work
    const log = await execa('git', ['log', '--format="%h"']);
    return log.stdout.split('\n').length;
  }

  const wc = await execa.shell('git log --format="%h" | wc -l');
  return parseFloat(wc.stdout.trim());
}

async function getVersionInfo({ isRelease, pkg }) {
  return {
    buildSha: await execa.stdout('git', ['rev-parse', 'HEAD']),
    buildVersion: isRelease ? pkg.version : `${pkg.version}-SNAPSHOT`,
    buildNumber: await getBuildNumber(),
  };
}

export async function getConfigs({ isRelaese }) {
  const pkgPath = resolve(__dirname, '../../package.json');
  const pkg = require(pkgPath);
  const repoRoot = dirname(pkgPath);
  const nodeVersion = pkg.engines.node;

  const platforms = ['darwin', 'linux', 'windows'].map(createPlatform);
  const versionInfo = await getVersionInfo({
    isRelease,
    pkg,
  });


  return new class Config {
    getPkg() {
      return pkg;
    }

    getNodeVersion() {
      return nodeVersion;
    }

    getRepoRelativePath(absolutePath) {
      return relative(repoRoot, absolutePath);
    }

    resolveFromRepo(...subPaths) {
      return resolve(repoRoot, ...subPaths);
    }

    getPlatform() {
      return platforms;
    }

    getLinuxPlatform() {
      return platforms.find(p => p.isLinux());
    }

    getWindowsPlatform() {
      return platforms.find(p => p.isWindows());
    }

    getMacPlatform() {
      return platforms.find(p => p.isMac());
    }

    getPlatformForThisOs() {
      switch (getOsPlatform()) {
        case 'darwin':
          return this.getMacPlatform();
        case 'win32':
          return this.getWindowsPlatform();
        case 'linux':
          return this.getLinuxPlatform();
        default:
          throw new Error(`Unable to find platform for this os`);
      }
    }

    getBuildVersion() {
      return versionInfo.buildVersion;
    }

    getBuildNumber() {
      return versionInfo.buildNumber;
    }

    getBuildSha() {
      return versionInfo.buildSha;
    }

    resolveFromTarget(...subPaths) {
      return resolve(repoRoot, 'target', ...subPaths);
    }
  }();
}
