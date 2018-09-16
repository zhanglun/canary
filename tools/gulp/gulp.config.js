
module.exports = (base = {}) => {
  let common = Object.assign({}, base);

  common.config = {};

  // build config
  common.build = require('./config/build')();
  common.platforms = require('./config/platforms')();

  return common;
};
