const services = require('../services');
const logger = require('./logger');

console.log(logger);

module.exports = (app) => {
  app.services = services;
  app.context.services = services;

  app.logger = logger;
  app.context.logger = logger;
};
