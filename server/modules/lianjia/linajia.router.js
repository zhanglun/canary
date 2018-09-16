class Router {
  constructor(app) {
    this.app = app;
    this.config = app.config;

    return this.init();
  }

  init() {

    const Router = require('koa-router');
    let Controller = require('./lianjia.controller');

    let wrapper = new Router();
    let router = new Router();
    let controller = Controller(this.app);


    console.log(controller);

    router
      .get('/ershoufang', controller.getErShouFang)

    wrapper.use('/lianjia', router.routes());

    return wrapper;
  }
};

module.exports = Router;
