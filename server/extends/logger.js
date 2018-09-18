const fs = require('fs');
const path = require('path');
const pinoms = require('pino-multi-stream');
const config = require('../config');

class Logger {
  constructor() {
    let pretty = pinoms.pretty();

    pretty.pipe(process.stdout);

    const streams = [
      {stream: fs.createWriteStream(path.resolve(__dirname, `../../logs/${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}.log`))},
      {stream: pretty},
    ];
    this.logger = pinoms({
      streams: streams,
    });

    return this.logger;
  }
}

module.exports = new Logger();
