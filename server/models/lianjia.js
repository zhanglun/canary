const mysql = require('../extends/mysql');

class LianjiaModel {
  constructor() {
    this.tableErshoufang = 'ershoufang';
    this.tableChengjiao = 'chengjiao';
    this.tableXiaoqu = 'xiaoqu';
  }

  /**
   * 获取期刊
   * @returns {Promise<*>}
   */
  async getErShouFang(options = { limit: 10, offset: 0 }) {
    let sql = `SELECT * FROM ?? WHERE city = '${options.where.city}' ORDER BY ${options.order_by} ${
      options.order
    } LIMIT ${options.limit} OFFSET ${options.offset}`;
    let result = await mysql.query(sql, [this.tableErshoufang]);
    let count = await mysql.query('SELECT count(*) FROM ??', [this.tableErshoufang]);

    return {
      count,
      result,
    };
  }

  async getChengjiao(options = { limit: 10, offset: 0 }) {
    let sql = `SELECT * FROM ?? WHERE city = '${options.where.city}' and sign_at >= '2016-01-01 00:00' and sign_at < '2017-01-01 00:00' ORDER BY ${options.order_by} ${
      options.order
    } LIMIT ${options.limit} OFFSET ${options.offset}`;
    let result = await mysql.query(sql, [this.tableChengjiao]);
    let count = await mysql.query('SELECT count(*) FROM ??', [this.tableChengjiao]);

    return {
      count,
      result,
    };
  }

  async getChengjiaoCount(options = { limit: 10, offset: 0 }) {
    let count = await mysql.query('SELECT count(*) FROM ??', [this.tableChengjiao]);

    return {
      count,
    };
  }

  async getXiaoqu(options = { limit: 10, offset: 0 }) {
    let sql = `SELECT * FROM ?? WHERE city = '${options.where.city}' ORDER BY ${options.order_by} ${
      options.order
    } LIMIT ${options.limit} OFFSET ${options.offset}`;
    let result = await mysql.query(sql, [this.tableXiaoqu]);
    let count = await mysql.query('SELECT count(*) FROM ??', [this.tableXiaoqu]);

    return {
      count,
      result,
    };
  }

  async getOverview() {
    let sql = 'SELECT COUNT(id) as total from ??';

    let [ ershoufang ] = await mysql.query(sql, [this.tableErshoufang]);
    let [ chengjiao ] = await mysql.query(sql, [this.tableChengjiao]);
    let [ xiaoqu ] = await mysql.query(sql, [this.tableXiaoqu]);

    return {
      ershoufang: ershoufang.total,
      chengjiao: chengjiao.total,
      xiaoqu: xiaoqu.total,
    };
  }
}

module.exports = LianjiaModel;
