const MusicService = require('./music');

class Service {
  constructor(app) {
    this.app = app;
  }

  init() {
    const { app } = this;

    return {
      music: new MusicService(app),
    }
  }
}

module.exports = Service;
