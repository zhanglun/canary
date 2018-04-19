const services = require('../services');
const models = require('../models');
const Logger = require('./logger');
const MySQLExtend = require('./mysql');

module.exports = (app) => {
  const logger = new Logger(app);
  app.logger = logger;
  app.context.logger = logger;

  app.mysql = new MySQLExtend();

  const model = models(app);
  app.models = model;
  app.context.models = model;

  const service = services(app);
  app.services = service;
  app.context.services = service;
};
