const Model = require('../models/luoo');

class Service {
  constructor() {
    this.model = new Model();
  }

  async getVols(params = {page_size: 10, page: 1}) {
    let options = {};

    console.log(params);

    options.limit = params.page_size;
    options.offset = params.page_size * (params.page - 1);

    options.order_by = params.order_by || 'vol_number';
    options.order = params.order || 'desc';


    let result = await this.model.getVols(options);

    return result;
  }
}

module.exports = Service;