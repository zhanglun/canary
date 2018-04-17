const logger = require('./logger');
const config = require('./config');
const Mysql = require('./mysql');
const model = require('../models');
const service = require('../services');

module.exports = (app) => {
  app.logger = logger;
  app.context.logger = logger;

  app.logger.info(config);
  app.config = config;

  app.mysql = new Mysql(config.mysql);
  app.context.mysql = app.mysql;

  app.models = model(app);
  app.context.models = model(app);

  app.services = service(app);
  app.context.services = service(app);

};
