const xlsx = require('node-xlsx');
const LianjiaModel = require('../models/lianjia');

class Controller {
  constructor() {
    this.lianjiaModel = new LianjiaModel();

    this.getErShouFang = this.getErShouFang.bind(this);
    this.exportData = this.exportData.bind(this);
  }

  async getErShouFang(ctx, next) {
    let query = ctx.query;

    query = Object.assign(
      {
        page_size: 10,
        page: 1,
      },
      query,
    );

    let options = {};

    options.limit = query.page_size;
    options.offset = query.page_size * (query.page - 1);

    options.order_by = query.order_by || 'input_time';
    options.order = query.order || 'desc';

    let { result, count } = await this.lianjiaModel.getErShouFang(options);

    result.forEach((item) => {
      try {
        item.transaction = item.transaction ? JSON.parse(item.transaction) : '[]';
      } catch (error) {
        item.transaction = item.transaction;
      }
      try {
        item.cost_payment = item.cost_payment ? JSON.parse(item.cost_payment) : '[]';
      } catch (error) {
        item.cost_payment = item.cost_payment;
      }

      return item;
    });

    ctx.set('PaginationTotal', count);
    ctx.set('PaginationNext', query.page + 1);

    ctx.body = result;
  }

  async exportData(ctx, next) {
    let query = ctx.query.body;
    let options = {};

    query = Object.assign(
      {
        page_size: 100000,
        page: 1,
      },
      query,
    );
    options.limit = query.page_size;
    options.offset = query.page_size * (query.page - 1)

    options.order_by = query.order_by || 'input_time';
    options.order = query.order || 'desc';

    let { result } = await this.lianjiaModel.getErShouFang(options);

    let resultCons = [['标题', '网页源地址', '总价(万)', '单价(万)', '楼盘', '板块', '录入时间']];
    let resultListUpdated = false;

    result.forEach((item) => {
      item.transaction = item.transaction.replace('\n', ' ');

      try {
        item.transaction = item.transaction ? JSON.parse(item.transaction) : '[]';
      } catch (error) {
        console.log(item);
        item.transaction = item.transaction;
      }
      try {
        item.cost_payment = item.cost_payment ? JSON.parse(item.cost_payment) : '{}';
      } catch (error) {
        item.cost_payment = item.cost_payment;
      }

      item.transactionMap = {};

      let resource = [
        item.title,
        item.origin_url,
        item.price_total,
        item.unit_price,
        item.community_name,
        item.area_name,
        item.input_time,
      ];

      // 房租的首付和月供


      // 房屋的交易信息
      item.transaction.forEach((trans) => {
        item.transactionMap[trans.label] = trans.value;
      });

      Object.keys(item.transactionMap).forEach((key) => {
        if (!resultListUpdated) {
          resultCons[0].push(key);
        }

        resource.push(item.transactionMap[key]);

        return key;
      });

      resultListUpdated = true;

      resultCons.push(resource);

      return item;
    });

    let buffer = xlsx.build([{ name: 'test', data: resultCons }]);
    let d = new Date();

    let datestring = `
      ${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}-${d.getHours()}:${d.getMinutes()}`;

    ctx.attachment(`二手房信息-${datestring}.xlsx`);

    ctx.body = buffer;
  }
}

module.exports = Controller;
