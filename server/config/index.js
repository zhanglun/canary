const fs = require('fs');
const path = require('path');
const jsYaml = require('js-yaml');

const loadYaml = (name) => {
  return jsYaml.safeLoad(fs.readFileSync(path.join(__dirname, `./config.${name}.yaml`), 'utf-8'));
};

module.exports = (function() {
  let env = process.env.NODE_ENV === 'development' ? 'env' : process.env.NODE_ENV;
  let config = {
    env,
  };

  let defaultConfig = loadYaml('default');
  let envConfig = {};

  ['dev', 'test', 'production'].map((env) => {
    if (env === config.env) {
      envConfig = loadYaml(env);
    }

    return env;
  });

  config = Object.assign({}, config, defaultConfig, envConfig);

  return config;
})();
