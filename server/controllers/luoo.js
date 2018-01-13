const Service = require('../services/music');
const Router = require('koa-router');

let service = new Service();
let wrapper = new Router();
let controller = new Router();

controller
  .get('/', async (ctx, next) => {
    ctx.body = 'Welcome API Index!';
  })
  .get('/vols', async (ctx, next) => {
    let query = ctx.query;

    console.log(query);
    query = Object.assign({
      page_size: 10,
      page: 1,
    }, query);

    let result = await service.getVols(query);

    ctx.body = result;
  });

wrapper.use('/luoo', controller.routes());

module.exports = wrapper;
