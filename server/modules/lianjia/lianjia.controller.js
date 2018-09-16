const Model = require('./lianjia.model');

module.exports = (app) => {
  const model = new Model(app);

  return {
    async getErShouFang(ctx, next) {
      let query = ctx.query;

      query = Object.assign({
        page_size: 10,
        page: 1,
      }, query);

      let options = {};

      options.limit = query.page_size;
      options.offset = query.page_size * (query.page - 1);

      options.order_by = query.order_by || 'input_time';
      options.order = query.order || 'desc';

      let result = await model.getErShouFang(options);

      ctx.body = result;
    },
  };
};
