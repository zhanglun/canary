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

    query = Object.assign({
      page_size: 10,
      page: 1,
    }, query);

    let result = await service.getVols(query);

    ctx.body = result;
  })
  .get('/vols/:vol_id', async (ctx, next) => {
    let { vol_id } = ctx.params;
    let result = await service.getVolById(vol_id);

    ctx.body = result;
  })
  .get('/tags', async (ctx, next) =>{
    let result = await service.getTags();

    ctx.body = result;
  });

wrapper.use('/luoo', controller.routes());

module.exports = wrapper;
