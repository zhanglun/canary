const xlsx = require('node-xlsx');
const LianjiaModel = require('../models/lianjia');

class Controller {
  constructor() {
    this.lianjiaModel = new LianjiaModel();

    this.getErShouFang = this.getErShouFang.bind(this);
    this.exportData = this.exportData.bind(this);
    this.exportChengjiaoData = this.exportChengjiaoData.bind(this);
    this.exportXiaoquData = this.exportXiaoquData.bind(this);
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

    // TODO: 过滤字段参数

    let options = {};

    options.limit = query.page_size;
    options.offset = query.page_size * (query.page - 1);

    options.order_by = query.order_by || 'input_time';
    options.order = query.order || 'desc';

    options.where = {
      city: query.city || 'bj',
    };

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
    let query = ctx.request.body;
    let options = {};

    console.log(query);

    query = Object.assign(
      {
        page_size: 100000,
        page: 1,
      },
      query,
    );
    options.limit = query.page_size;
    options.offset = query.page_size * (query.page - 1);

    options.order_by = query.order_by || 'input_time';
    options.order = query.order || 'desc';

    options.where = {
      city: query.city || 'bj',
    };

    let { result } = await this.lianjiaModel.getErShouFang(options);

    let resultCons = [['标题', '网页源地址', '总价(万)', '单价(万)', '楼盘', '板块', '录入时间']];
    let resultListUpdated = false;

    result.forEach((item) => {
      item.transaction = item.transaction.replace('\n', ' ');

      try {
        item.transaction = item.transaction ? JSON.parse(item.transaction) : '[]';
      } catch (error) {
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

      if (!resultListUpdated) {
        resultCons[0].push('净首付');
        resultCons[0].push('税费合计');
        resultCons[0].push('其他费用(以实际费用为主)');
      }

      resource.push(item.cost_payment.cost_house);
      resource.push(item.cost_payment.cost_tax);
      resource.push(item.cost_payment.cost_jingjiren);

      resultListUpdated = true;

      resultCons.push(resource);

      return item;
    });

    let buffer = xlsx.build([{ name: 'test', data: resultCons }]);
    let d = new Date();

    let datestring = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}-${d.getHours()}:${d.getMinutes()}`;

    ctx.attachment(`二手房信息-${datestring}.xlsx`);

    console.log(resultCons[0]);

    ctx.body = buffer;
  }

  async exportChengjiaoData(ctx, next) {
    let query = ctx.request.body;
    let options = {};

    query = Object.assign(
      {
        page_size: 100000,
        page: 1,
      },
      query,
    );
    options.limit = query.page_size;
    options.offset = query.page_size * (query.page - 1);

    options.order_by = query.order_by || 'input_at';
    options.order = query.order || 'desc';

    options.where = {
      city: query.city || 'bj',
    };

    let { result } = await this.lianjiaModel.getChengjiao(options);

    let resultCons = [
      [
        '成交时间',
        '成交方式',
        '所在城市',
        '名称',
        '总价(万)',
        '单价(万)',
        '房屋构成',
        '楼层',
        '朝向',
        '其他信息',
        '房屋大小',
        '建造年份',
        '建筑形态',
        '网页标题',
        '网页源地址',
        '采集时间',
      ],
    ];

    result.forEach((item) => {
      let resource = [
        item.sign_at,
        item.sign_method,
        item.city,
        item.area_name,
        parseInt(item.total_price, 10),
        parseInt(item.unit_price, 10),
        item.building_structure,
        item.building_floor,
        item.building_towards,
        item.building_meta,
        item.building_size,
        item.building_year,
        item.building_style,
        item.origin_title,
        item.origin_url,
        item.input_at,
      ];

      resultCons.push(resource);

      return item;
    });

    let buffer = xlsx.build([{ name: 'test', data: resultCons }]);
    let d = new Date();

    let datestring = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}-${d.getHours()}:${d.getMinutes()}`;

    ctx.attachment(`成交信息-${datestring}.xlsx`);

    ctx.body = buffer;
  }

  async exportXiaoquData(ctx, next) {
    let query = ctx.request.body;
    let options = {};

    query = Object.assign(
      {
        page_size: 100000,
        page: 1,
      },
      query,
    );
    options.limit = query.page_size;
    options.offset = query.page_size * (query.page - 1);

    options.order_by = query.order_by || 'input_at';
    options.order = query.order || 'desc';

    options.where = {
      city: query.city || 'bj',
    };

    let { result } = await this.lianjiaModel.getXiaoqu(options);

    let resultCons = [
      [
        '所在城市',
        '地址',
        '小区名称',
        '均价(万)',
        '建筑年代',
        '建筑类型',
        '物业费用',
        '物业公司',
        '开发商',
        '楼栋总数',
        '房屋总数',
        '网页标题',
        '网页源地址',
        '录入时间',
      ],
    ];

    result.forEach((item) => {
      let resource = [
        item.city,
        item.address,
        item.name,
        parseInt(item.average_price, 10),
        item.building_year,
        item.building_type,
        item.service_fees,
        item.service_company,
        item.developers,
        item.building_count,
        item.house_count,
        item.origin_title,
        item.origin_url,
        item.input_at,
      ];

      resultCons.push(resource);

      return item;
    });

    let buffer = xlsx.build([{ name: 'test', data: resultCons }]);
    let d = new Date();

    let datestring = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}-${d.getHours()}:${d.getMinutes()}`;

    ctx.attachment(`小区信息-${datestring}.xlsx`);

    ctx.body = buffer;
  }
}

module.exports = Controller;
