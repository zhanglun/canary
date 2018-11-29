const Writer = require('xlsx-writestream'); // https://github.com/STRML/node-xlsx-writestream
const fs = require('fs');
const xlsx = require('node-xlsx');
const LianjiaModel = require('../models/lianjia');
const moment = require('moment');
const CITY_DICT = require('./city');

class Controller {
  constructor() {
    this.lianjiaModel = new LianjiaModel();

    this.getErShouFang = this.getErShouFang.bind(this);
    this.exportData = this.exportData.bind(this);
    this.exportChengjiaoData = this.exportChengjiaoData.bind(this);
    this.exportXiaoquData = this.exportXiaoquData.bind(this);
    this.exportZufangData = this.exportZufangData.bind(this);
    this.getOverview = this.getOverview.bind(this);
  }

  async getErShouFang(ctx, next) {
    let options = ctx.__lianjia_query_options;
    let query = ctx.request.query;

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
    let options = ctx.__lianjia_query_options;
    let query = ctx.request.query;

    let { result } = await this.lianjiaModel.getErShouFang(options);

    let resultCons = [['标题', '网页源地址', '总价(万)', '单价(万)', '楼盘', '板块', '录入时间']];
    let resultListUpdated = false;

    result.forEach((item) => {
      item.transaction_attributes = item.transaction_attributes.replace('\n', ' ');

      try {
        item.transaction_attributes = item.transaction_attributes
          ? JSON.parse(item.transaction_attributes)
          : '[]';
      } catch (error) {
        item.transaction_attributes = [];
      }

      try {
        item.base_attributes = item.base_attributes ? JSON.parse(item.base_attributes) : '[]';
      } catch (error) {
        item.base_attributes = [];
      }

      try {
        item.cost_payment = item.cost_payment ? JSON.parse(item.cost_payment) : '{}';
      } catch (error) {
        item.cost_payment = {};
      }

      item.transactionAttributesMap = {};
      item.baseAttrbutesMap = {};

      let resource = [
        item.origin_title,
        item.origin_url,
        item.price_total,
        item.unit_price,
        item.community_name,
        item.area_name,
        moment(item.input_at).format('YYYY-MM-DD hh:mm'),
      ];

      // 房屋的交易信息
      item.transaction_attributes.forEach((trans) => {
        item.transactionAttributesMap[trans.label] = trans.value || '暂无信息';
      });

      item.base_attributes.forEach((trans) => {
        item.baseAttrbutesMap[trans.label] = trans.value || '暂无信息';
      });

      Object.keys(item.transactionAttributesMap).forEach((key) => {
        if (!resultListUpdated) {
          resultCons[0].push(key);
        }

        resource.push(item.transactionAttributesMap[key] || '暂无信息');

        return key;
      });

      // Object.keys(item.baseAttrbutesMap).forEach((key) => {
      //   if (!resultListUpdated) {
      //     resultCons[0].push(key);
      //   }

      //   resource.push(item.baseAttrbutesMap[key]);

      //   return key;
      // });

      if (!resultListUpdated) {
        resultCons[0].push('净首付');
        resultCons[0].push('税费合计');
        resultCons[0].push('其他费用(以实际费用为主)');
      }

      resource.push(item.cost_payment.cost_house || '暂无信息');
      resource.push(item.cost_payment.cost_tax || '暂无信息');
      resource.push(item.cost_payment.cost_jingjiren || '暂无信息');

      let community_meta = {};
      try {
        community_meta = JSON.parse(item.community_meta || '{}');
      } catch (error) {
        community_meta = {};
      }
      let metaString = '暂无信息';

      if (community_meta.resblock) {
        if (!resultListUpdated) {
          resultCons[0].push('该小区其他情况');
        }
        metaString = `目前有 ${community_meta.resblock.sellNum} 套房源出售中, 挂牌均价 ${
          community_meta.resblock.unitPrice
        }元/平`;
      }

      resource.push(metaString);

      resultListUpdated = true;

      resultCons.push(resource);

      return item;
    });

    let buffer = xlsx.build([
      {
        name: '二手房',
        data: resultCons,
      },
    ]);
    let d = new Date();

    let datestring = `${d.getFullYear()}-${d.getMonth() +
      1}-${d.getDate()}-${d.getHours()}:${d.getMinutes()}`;

    ctx.attachment(`链家网数据-二手房信息-${CITY_DICT[query.city]}-${datestring}.xlsx`);

    console.log(resultCons[0]);

    ctx.body = buffer;
  }

  async exportChengjiaoData(ctx, next) {
    let options = ctx.__lianjia_query_options;
    let query = ctx.request.query;

    let { count } = await this.lianjiaModel.getChengjiaoCountByCity(options.where.city, options);

    let steps = Math.ceil(count / 10000);

    console.log(steps);
    let promise = [];

    for (let i = 0; i < steps; i++) {
      let options = JSON.parse(JSON.stringify(ctx.__lianjia_query_options));

      options.limit = 10000;
      options.offset = 10000 * i;

      promise.push(this.lianjiaModel.getChengjiao(options));
    }

    let d = new Date();
    let datestring = `${d.getFullYear()}-${d.getMonth() +
      1}-${d.getDate()}-${d.getHours()}${d.getMinutes()}`;
    let writer = new Writer();

    writer
      .getReadStream()
      .pipe(
        fs.createWriteStream(
          `链家网数据-成交信息-${CITY_DICT[options.where.city]}-${datestring}.xlsx`,
        ),
      );

    writer.defineColumns([
      {
        width: 30,
      }, // width is in 'characters'
      {
        width: 10,
      },
    ]);

    // 构建队列
    function queue(arr, cb) {
      let sequence = Promise.resolve();

      arr.forEach((promise, i) => {
        sequence = sequence
          .then(async () => {
            let { result } = await promise;

            console.log(i);
            cb(result, i);

            return result;
          });
      });

      return sequence;
    }

    let cb = (result, i) => {
      result.forEach((item) => {
        let community_meta = {};
        try {
          community_meta = JSON.parse(item.community_meta || '{}');
        } catch (error) {
          community_meta = {};
        }
        let metaString = '';

        if (community_meta && community_meta.resblock) {
          metaString = `目前有 ${community_meta.resblock.sellNum} 套房源出售中, 挂牌均价 ${
            community_meta.resblock.unitPrice
          }元/平`;
        }

        writer.addRow({
          成交时间: moment(item.sign_at).format('YYYY-MM-DD hh:mm'),
          成交方式: item.sign_method,
          所在城市: CITY_DICT[item.city] || item.city,
          所在城区: item.city_area,
          所在地区: item.area_name,
          所在小区: item.community_name,
          小区其他情况: metaString,
          '总价(万)': parseInt(item.total_price || 0, 10),
          '单价(万)': parseInt(item.unit_price || 0, 10),
          房屋构成: item.building_structure,
          楼层: item.building_floor,
          朝向: item.building_towards,
          其他信息: item.building_meta,
          房屋大小: item.building_size,
          建造年份: item.building_year,
          建筑形态: item.building_style,
          网页标题: item.origin_title,
          网页源地址: {
            value: item.origin_url,
            hyperlink: item.origin_url,
          },
          采集时间: moment(item.input_at).format('YYYY-MM-DD hh:mm'),
        });
      });

      if (i == steps.length - 1) {
        writer.finalize();
      }
    };

    // 执行队列
    queue(promise, cb).then((data) => {
      console.log('data', data.length); // abc
    });

    // // ctx.attachment(`链家网数据-成交信息-${CITY_DICT[query.city]}-${datestring}.xlsx`);
    // // ctx.body = writer.getReadStream();

    ctx.body = 'ok';
  }

  async exportXiaoquData(ctx, next) {
    let options = ctx.__lianjia_query_options;
    let query = ctx.request.query;
    let { result } = await this.lianjiaModel.getXiaoqu(options);

    let resultCons = [
      [
        '所在城市',
        '地址',
        '小区名称',
        '经度',
        '维度',
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
        CITY_DICT[item.city] || item.city,
        item.address,
        item.name,
        item.lng,
        item.lat,
        parseInt(item.average_price || 0, 10),
        item.building_year,
        item.building_type,
        item.service_fees,
        item.service_company,
        item.developers,
        item.building_count,
        item.house_count,
        item.origin_title,
        item.origin_url,
        moment(item.input_at).format('YYYY-MM-DD hh:mm'),
      ];

      resultCons.push(resource);

      return item;
    });

    let buffer = xlsx.build([
      {
        name: '小区',
        data: resultCons,
      },
    ]);
    let d = new Date();

    let datestring = `${d.getFullYear()}-${d.getMonth() +
      1}-${d.getDate()}-${d.getHours()}:${d.getMinutes()}`;

    ctx.attachment(
      `链家网小区数据小区信息-${datestring}-${CITY_DICT[query.city] || query.city}.xlsx`,
    );

    ctx.body = buffer;
  }

  async exportZufangData(ctx, next) {
    let options = ctx.__lianjia_query_options;
    let query = ctx.request.query;

    let { result } = await this.lianjiaModel.getZufang(options);

    let resultCons = [
      [
        '所在城市',
        '所在城区',
        '所在地区',
        '所在小区',
        '租金',
        '租金单位',
        '发布时间',
        '租赁状态',
        '户型',
        '楼层',
        '朝向',
        '面积',
        '套内面积',
        '地铁信息',
        '网页标题',
        '网页源地址',
      ],
    ];

    result.forEach((item) => {
      let resource = [
        CITY_DICT[item.city] || item.city,
        item.city_area,
        item.area_name,
        item.community_name,
        item.monthly_rent,
        item.monthly_rent_unit,
        moment(item.publish_at).format('YYYY-MM-DD hh:mm'),
        item.status,
        item.building_structure.replace('整租', '').trim(),
        item.building_floor,
        item.building_towards,
        item.floor_area,
        item.floor_inside_area,
        item.subway_info,
        item.origin_title,
        item.origin_url,
      ];

      resultCons.push(resource);

      return item;
    });

    console.log(result.length);

    let buffer = xlsx.build([
      {
        name: '租房',
        data: resultCons,
      },
    ]);
    let d = new Date();

    let datestring = `${d.getFullYear()}-${d.getMonth() +
      1}-${d.getDate()}-${d.getHours()}:${d.getMinutes()}`;

    ctx.attachment(`链家网租房信息-${datestring}-${CITY_DICT[query.city] || query.city}.xlsx`);

    ctx.body = buffer;
  }

  async getOverview(ctx, next) {
    let count = await this.lianjiaModel.getOverview();

    ctx.body = count;
  }
}

module.exports = Controller;
