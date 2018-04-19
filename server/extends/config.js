const fs = require('fs');
const path = require('path');
const jsYaml = require('js-yaml');

const loadYaml = (name) => {
  return jsYaml.safeLoad(fs.readFileSync(path.join(__dirname, `../config/config.${name}.yaml`), 'utf-8'));
};

module.exports = function() {
  let config = {
    env: process.env.NODE_ENV || 'development',
  };

  let defaultConfig = loadYaml('default');
  let envConfig = {};

  ['dev', 'production'].map((env) => {
    if (env === config.env) {
      envConfig = loadYaml(env);
    }
  });

  config = Object.assign({}, config, defaultConfig, envConfig);

  return config;
};
