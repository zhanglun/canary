const MusicService = require('./music');

module.exports = function (app) {
  return {
    music: new MusicService(app),
  }
};
