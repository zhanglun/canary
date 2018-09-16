const config = require('./config')();
const Logger = require('./logger');
const MySQLExtend = require('./mysql');

module.exports = (app) => {
  app.config = config;
  app.context.config = config;

  const logger = new Logger(app);
  app.logger = logger;
  app.context.logger = logger;

  app.mysql = new MySQLExtend(app);
};
