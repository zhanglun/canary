const mysql = require('../extends/mysql');

class LianjiaModel {
  constructor() {
    this.tableErshoufang = 'lianjia_ershoufang';
    this.tableChengjiao = 'lianjia_chengjiao';
    this.tableXiaoqu = 'lianjia_xiaoqu';
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
    let sql = `SELECT * FROM ?? WHERE city = '${options.where.city}' ORDER BY ${options.order_by} ${
      options.order
    } LIMIT ${options.limit} OFFSET ${options.offset}`;
    let result = await mysql.query(sql, [this.tableChengjiao]);
    let count = await mysql.query('SELECT count(*) FROM ??', [this.tableChengjiao]);

    return {
      count,
      result,
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
}

module.exports = LianjiaModel;
