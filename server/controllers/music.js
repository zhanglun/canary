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

    let result = await ctx.app.services.music.getVols(query);
    console.log('======>');
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
