module.exports = (app) => {
  return async (ctx, next) => {
    let query = ctx.query;

    query = Object.assign(
      {
        page_size: 10000000,
        page: 1,
      },
      query,
    );

    let options = {};

    options.limit = query.page_size;
    options.offset = query.page_size * (query.page - 1);

    options.order_by = query.order_by || 'input_at';
    options.order = query.order || 'desc';

    options.where = {
      city: query.city || 'bj',
    };

    ctx.__lianjia_query_options = options;

    await next();
  };
};
