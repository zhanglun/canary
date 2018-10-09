const mysql = require('../extends/mysql');

class LianjiaModel {
  constructor(){
    this.tableErshoufang = 'lianjia_ershoufang';
  }


  /**
   * 获取期刊
   * @returns {Promise<*>}
   */
  async getErShouFang(options = { limit: 10, offset: 0 }) {
    let sql = `SELECT * FROM ?? WHERE city = '${options.where.city}' ORDER BY ${options.order_by} ${options.order} LIMIT ${options.limit} OFFSET ${options.offset}`;
    let result = await mysql.query(sql, [this.tableErshoufang]);
    let count = await mysql.query('SELECT count(*) FROM ??', [this.tableErshoufang]);

    return {
      count,
      result
    };
  }

}

module.exports = LianjiaModel;

