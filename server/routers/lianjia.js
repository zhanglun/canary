const config = require('../config');

class Router {
  constructor() {
    this.config = config;

    return this.init();
  }

  init() {

    const Router = require('koa-router');
    let Controller = require('../controllers/lianjia');

    let router = new Router({
      prefix: '/lianjia',
    });
    let controller = new Controller();


    console.log(controller);

    router
      .get('/ershoufang', controller.getErShouFang)

    // wrapper.use('/lianjia', router.routes());

    return router;
  }
}

module.exports = Router;
