const pkg = require('../../package.json');
const platform = require('./platform');

module.exports = async function (args) {
	const root = process.cwd();
	const path_client = '../../client';
  const path_server = '../../server';

  let config = {
    path_server,
    path_client,
    root,
  };

  config = await platform.getConfigs({ ...args});

  console.log(platform.getConfigs);

  return config;
};
