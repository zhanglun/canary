const Music = require('./luoo');

module.exports = function(app) {
  return {
    music: new Music(app),
  }
};
