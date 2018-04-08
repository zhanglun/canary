class MusicController {
  async getIndex (ctx, next) {
    ctx.body = 'Welcome API Index!';
  }
  async getVols(ctx, next) {
    let query = ctx.query;

    query = Object.assign({
      page_size: 10,
      page: 1,
    }, query);

    let result = await service.getVols(query);
    console.log('======>');
    ctx.body = result;
  }
  
  async getVolsByVolId(ctx, next) {
    let { vol_id } = ctx.params;
    let result = await service.getVolById(vol_id);

    ctx.body = result;
  }

  async getTags(ctx, next) {
    let result = await service.getTags();

    ctx.body = result;
  }
}

module.exports = MusicController;
