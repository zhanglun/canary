const fs = require('fs');
const pinoms = require('pino-multi-stream');

class Logger {
  constructor(app) {
    this.app = app;

    const streams = [
      {stream: process.stdout},
      {stream: fs.createWriteStream(`${this.app.root}/logs/${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}.log`)},
    ];

    this.logger = pinoms({streams: streams});
  }

  info(...args) {
    this.logger.info(...args);
  }

  error(...args) {
    this.logger.error(...args);
  }

  debug(...args) {
    this.logger.debug(...args);
  }

  trace(...args) {
    this.logger.trace(...args);
  }
}

module.exports = Logger;
