const Service = require('../services');
const logger = require('./logger');
const config = require('./config');

module.exports = (app) => {
  app.services = new Service(app).init();
  app.context.services = new Service(app).init();

  app.logger = logger;
  app.context.logger = logger;

  app.logger.info(config);
  app.config = config;
};
