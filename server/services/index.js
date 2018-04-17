const Music = require('./music');

module.exports = function(app) {
  return {
    music: new Music(app),
  };
};
