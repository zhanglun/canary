const Service = require('../services');
const logger = require('./logger');

module.exports = (app) => {
  app.services = new Service(app).init();
  app.context.services = new Service(app).init();
  console.log(app.services);

  app.logger = logger;
  app.context.logger = logger;
};
