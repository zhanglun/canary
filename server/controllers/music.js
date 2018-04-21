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

    let options = {};

    options.limit = query.page_size;
    options.offset = query.page_size * (query.page - 1);

    options.order_by = query.order_by || 'vol_number';
    options.order = query.order || 'desc';

    let result = await ctx.app.models.music.getVols(options);

    ctx.body = result;
  }

  async getVolsByVolId(ctx, next) {
    let { vol_id } = ctx.params;
    let result = await ctx.app.services.music.getVolById(vol_id);

    ctx.body = result;
  }

  async getTags(ctx, next) {
    let result = await ctx.app.services.music.getTags();

    ctx.body = result;
  }
}

module.exports = MusicController;
