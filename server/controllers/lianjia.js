const LianjiaModel = require('../models/lianjia');

class Controller {
  constructor() {
    this.lianjiaModel = new LianjiaModel();

    this.getErShouFang = this.getErShouFang.bind(this);
  }

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

    let result = await this.lianjiaModel.getErShouFang(options);

    ctx.body = result;
  }
}

module.exports = Controller;
