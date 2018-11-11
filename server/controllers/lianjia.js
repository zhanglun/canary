const Writer = require('xlsx-writestream'); // https://github.com/STRML/node-xlsx-writestream
const fs = require('fs');
const xlsx = require('node-xlsx');
const LianjiaModel = require('../models/lianjia');
const moment = require('moment');

const CITY_DICT = {
  cz: '滁州',
  hf: '合肥',
  bj: '北京',
  cq: '重庆',
  fz: '福州',
  ly: '龙岩',
  quanzhou: '泉州',
  xm: '厦门',
  zhangzhou: '漳州',
  dg: '东莞',
  fs: '佛山',
  gz: '广州',
  hui: '惠州',
  qy: '清远',
  sz: '深圳',
  zh: '珠海',
  zhanjiang: '湛江',
  zs: '中山',
  gy: '贵阳',
  bh: '北海',
  huangshi: '黄石',
  hg: '黄冈',
  wh: '武汉',
  xy: '襄阳',
  xn: '咸宁',
  yichang: '宜昌',
  cs: '长沙',
  changde: '常德',
  zhuzhou: '株洲',
  bd: '保定',
  chengde: '承德',
  hd: '邯郸',
  hs: '衡水',
  lf: '廊坊',
  qhd: '秦皇岛',
  sjz: '石家庄',
  xt: '邢台',
  zjk: '张家口',
  bt: '保亭',
  cm: '澄迈',
  dz: '儋州',
  da: '定安',
  hk: '海口',
  lg: '临高',
  ld: '乐东',
  ls: '陵水',
  qh: '琼海',
  qz: '琼中',
  san: '三亚',
  wzs: '五指山',
  wc: '文昌',
  wn: '万宁',
  kf: '开封',
  luoyang: '洛阳',
  xinxiang: '新乡',
  xc: '许昌',
  zz: '郑州',
  hrb: '哈尔滨',
  ha: '淮安',
  nj: '南京',
  nt: '南通',
  su: '苏州',
  wx: '无锡',
  xz: '徐州',
  zj: '镇江',
  cc: '长春',
  nc: '南昌',
  sr: '上饶',
  dl: '大连',
  sy: '沈阳',
  hhht: '呼和浩特',
  yinchuan: '银川',
  sh: '上海',
  cd: '成都',
  dy: '德阳',
  dazhou: '达州',
  leshan: '乐山',
  mianyang: '绵阳',
  ms: '眉山',
  nanchong: '南充',
  jn: '济南',
  qd: '青岛',
  wf: '潍坊',
  weihai: '威海',
  yt: '烟台',
  zb: '淄博',
  xa: '西安',
  xianyang: '咸阳',
  jz: '晋中',
  ty: '太原',
  tj: '天津',
  dali: '大理',
  km: '昆明',
  xsbn: '西双版纳',
  hz: '杭州',
  jx: '嘉兴',
  nb: '宁波',
  sx: '绍兴',
};

class ExcelWriteExecutor {
  /**
   * 构造方法
   * @param path 路径
   * @param options
   */
  constructor(path, options = {}) {
    this.path = path;
    options.out = path;
    this.options = options;
    this.writer = new Writer(this.path, this.options);
    this.writer.getReadStream().pipe(fs.createWriteStream(this.path));
  }
  addRow(row) {
    this.writer.addRow(row);
  }
  addRows(rows) {
    this.writer.addRows(rows);
  }
  /**
   * 输出
   */
  execute() {
    return new Promise((resolve) => {
      this.writer.finalize();
      setTimeout(resolve, 50); //延迟50毫秒是因为 finalize 调用结束之后，excel打开会报错，可能是没写入完成的原因，加了延迟之后正常，延迟值根据需要自己测试可以更改
    });
  }
}

class Controller {
  constructor() {
    this.lianjiaModel = new LianjiaModel();

    this.getErShouFang = this.getErShouFang.bind(this);
    this.exportData = this.exportData.bind(this);
    this.exportChengjiaoData = this.exportChengjiaoData.bind(this);
    this.exportXiaoquData = this.exportXiaoquData.bind(this);
    this.getOverview = this.getOverview.bind(this);
  }

  async getErShouFang(ctx, next) {
    let query = ctx.query;

    query = Object.assign({
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

    let {
      result,
      count
    } = await this.lianjiaModel.getErShouFang(options);

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

    query = Object.assign({
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

    let {
      result
    } = await this.lianjiaModel.getErShouFang(options);

    let resultCons = [
      ['标题', '网页源地址', '总价(万)', '单价(万)', '楼盘', '板块', '录入时间']
    ];
    let resultListUpdated = false;

    result.forEach((item) => {
      item.transaction_attributes = item.transaction_attributes.replace('\n', ' ');

      try {
        item.transaction_attributes = item.transaction_attributes ? JSON.parse(item.transaction_attributes) : '[]';
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
        metaString = `目前有 ${community_meta.resblock.sellNum} 套房源出售中, 挂牌均价 ${community_meta.resblock.unitPrice}元/平`;
      }

      resource.push(metaString);

      resultListUpdated = true;

      resultCons.push(resource);

      return item;
    });

    let buffer = xlsx.build([{
      name: '二手房',
      data: resultCons
    }]);
    let d = new Date();

    let datestring = `${d.getFullYear()}-${d.getMonth() +
      1}-${d.getDate()}-${d.getHours()}:${d.getMinutes()}`;

    ctx.attachment(`链家网数据-二手房信息-${CITY_DICT[query.city]}-${datestring}.xlsx`);

    console.log(resultCons[0]);

    ctx.body = buffer;
  }

  async exportChengjiaoData(ctx, next) {
    let query = ctx.request.body;
    let options = {};

    query = Object.assign({
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
      city_area: '闵行',
    };

    let {
      result
    } = await this.lianjiaModel.getChengjiao(options);
    let d = new Date();
    let datestring = `${d.getFullYear()}-${d.getMonth() +
      1}-${d.getDate()}-${d.getHours()}:${d.getMinutes()}`;
    let writer = new Writer();

    // writer.getReadStream().pipe(fs.createWriteStream(`链家网数据-成交信息-${CITY_DICT[query.city]}-${datestring}.xlsx`));

    writer.defineColumns([{
        width: 30
      }, // width is in 'characters'
      {
        width: 10
      },
    ]);

    result.forEach((item) => {
      let community_meta = {};
      try {
        community_meta = JSON.parse(item.community_meta || '{}');
      } catch (error) {
        community_meta = {};
      }
      let metaString = '';

      if (community_meta && community_meta.resblock) {
        metaString = `目前有 ${community_meta.resblock.sellNum} 套房源出售中, 挂牌均价 ${community_meta.resblock.unitPrice}元/平`;
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

    writer.finalize();

    ctx.attachment(`链家网数据-成交信息-${CITY_DICT[query.city]}-${datestring}.xlsx`);
    ctx.body = writer.getReadStream();
  }

  async exportXiaoquData(ctx, next) {
    let query = ctx.request.body;
    let options = {};

    query = Object.assign({
        page_size: 100000,
        page: 1,
      },
      query,
    );
    options.limit = query.page_size;
    options.offset = query.page_size * (query.page - 1);

    options.order_by = query.order_by || 'input_at';
    options.order = query.order || 'desc';

    query.city = query.city || 'bj';
    options.where = {
      city: query.city || 'bj',
    };

    let {
      result
    } = await this.lianjiaModel.getXiaoqu(options);

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

    let buffer = xlsx.build([{
      name: '小区',
      data: resultCons
    }]);
    let d = new Date();

    let datestring = `${d.getFullYear()}-${d.getMonth() +
      1}-${d.getDate()}-${d.getHours()}:${d.getMinutes()}`;

    ctx.attachment(
      `链家网小区数据小区信息-${datestring}-${CITY_DICT[query.city] || query.city}.xlsx`,
    );

    ctx.body = buffer;
  }

  async getOverview(ctx, next) {
    let count = await this.lianjiaModel.getOverview();

    ctx.body = count;
  }
}

module.exports = Controller;
