const services = require('../services');
const logger = require('./logger');

module.exports = (app) => {
  app.services = services(app);
  app.context.services = services(app);

  app.logger = logger;
  app.context.logger = logger;
};
