const log4js = require('log4js');

class Logger {
  constructor() {
    this.log4js = log4js.getLogger();
  }

  info(...args) {
    this.log4js.level = 'info';
    this.log4js.info(...args);
  }

  debug(...args) {
    this.log4js.level = 'debug';
    this.log4js.error(...args);
  }

  error(...args) {
    this.log4js.level = 'error';
    this.log4js.error(...args);
  }

}
module.exports = new Logger();
