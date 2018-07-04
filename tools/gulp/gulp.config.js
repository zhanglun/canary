const pkg = require('../../package.json');
const platform = require('./platform');

module.exports = async function () {
	const root = process.cwd;
	const path_client = '../../client';
  const path_server = '../../server';

  const node_version = pkg.node_version;
  const release_version = pkg.version;

  let config = {
    path_server,
    path_client,
    root,
  };

  config = Object.assign({}, config, await platform.getConfigs());

  return config;
};
