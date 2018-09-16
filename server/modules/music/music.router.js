class Router {
  constructor(app) {
    this.app = app;
    this.config = app.config;

    return this.init();
  }

  init() {

    const Router = require('koa-router');
    let Controller = require('./music.controller');

    let wrapper = new Router();
    let router = new Router();
    let controller = Controller(this.app);

    router
      .get('/vols', controller.getVols)
      .get('/vols/:vol_id', controller.getVolById)
      .get('/tags', controller.getTags);

    wrapper.use('/luoo', router.routes());

    return wrapper;
  }
};

module.exports = Router;
