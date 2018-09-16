class MusicModel {
  constructor(app){
    this.app = app;
    this.tableErshoufang = 'lianjia_ershoufang';
  }


  /**
   * 获取期刊
   * @returns {Promise<*>}
   */
  async getErShouFang(options = { limit: 10, offset: 0 }) {
    let sql = `SELECT * FROM ?? ORDER BY ${options.order_by} ${options.order} LIMIT ${options.limit} OFFSET ${options.offset}`;
    let result = await this.app.mysql.query(sql, [this.tableErshoufang]);

    return result;
  }

}

module.exports = MusicModel;

