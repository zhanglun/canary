const Model = require('./music.model');

module.exports = (app) => {
  const model = new Model(app);

  return {
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

      let result = await model.getVols(options);

      ctx.body = result;
    },

    async getVolById(ctx, next) {
      let {
        vol_id
      } = ctx.params;
      let result = await model.getVolById(vol_id);

      ctx.body = result;
    },

    async getTags() {
      let result = await model.getTags();
      let list = [];

      let tagString = result.reduce((pre, cur, i, arr) => {
        pre.tags = pre.tags + cur.tags;

        return pre;
      }).tags;

      let tags = tagString.replace(/,/igm, '').split('#')
        .filter((tag) => {
          return tag;
        });

      ctx.body = [...new Set(tags)];
    }

  };

};
