const Router = require('koa-router');
let Controller = require('../controllers/music');

let wrapper = new Router();
let router = new Router();
let controller = new Controller();

router
  .get('/', controller.getIndex)
  .get('/vols', controller.getVols)
  .get('/vols/:vol_id', controller.getVolsByVolId)
  .get('/tags', controller.getTags)
;

wrapper.use('/luoo', router.routes());

module.exports = wrapper;
