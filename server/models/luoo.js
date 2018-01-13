const Base = require('./index');

class MusicModel extends Base {
  constructor(){
    super();

    this.tableVol = 'vol';
    this.tableTrack = 'track';
  }


  /**
   * 获取期刊
   * @returns {Promise<*>}
   */
  async getVols(options = {limit: 10, offset: 0}) {
    let sql = `SELECT * FROM ${this.tableVol} ORDER BY ${options.order_by} ${options.order} LIMIT ${options.limit} OFFSET ${options.offset}`;

    console.log(sql);

    let result = await this.query(sql, [this.tableVol]);

    return result;
  }

}

module.exports = MusicModel;

