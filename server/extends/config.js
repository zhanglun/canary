const path = require('path');
const fs = require('fs');
const yamlLoad = require('js-yaml');

let defaultConfigPath = path.join(__dirname, '../config', 'config.default.yaml');
let config = yamlLoad.safeLoad(fs.readFileSync(defaultConfigPath));

['production'].map((env) => {
  if (env === process.NODE_ENV) {
    let configPath = path.join(__dirname, '../config', `config.${env}.yaml`);

    config = Object.assign({}, config, yamlLoad.safeLoad(fs.readFileSync(configPath)));
  }
});

module.exports = config;
