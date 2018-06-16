const pkg = require('../../package.json');

module.exports = function () {
	const root = process.cwd;
	const path_client = '../../client';
  const path_server = '../../server';

  const node_version = pkg.node_version;
  const release_version = pkg.version;

  const config = {
    path_server,
    path_client,
    root,
  };

  return config;
};
