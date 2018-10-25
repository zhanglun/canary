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

    router.get('/ershoufang', controller.getErShouFang)
    router.post('/ershoufang/export', controller.exportData)
    router.post('/chengjiao/export', controller.exportChengjiaoData)
    router.post('/xiaoqu/export', controller.exportXiaoquData)

    return router;
  }
}

module.exports = Router;
