class MusicModel {
  constructor(app){
    this.app = app;
    this.tableVol = 'vol';
    this.tableTrack = 'track';
  }


  /**
   * 获取期刊
   * @returns {Promise<*>}
   */
  async getVols(options = { limit: 10, offset: 0 }) {
    let sql = `SELECT * FROM ?? ORDER BY ${options.order_by} ${options.order} LIMIT ${options.limit} OFFSET ${options.offset}`;
    let result = await this.app.mysql.query(sql, [this.tableVol]);

    return result;
  }

  /**
   * 通过ID获取期刊列表
   * @param  {String} id
   * @return {[type]}    [description]
   */
  async getVolById(id) {
    let sql = `SELECT * FROM ??  WHERE vol_id = ?`;
    let result = await this.app.mysql.query(sql, [this.tableVol, id]);

    let vol = result[0];
    if (vol) {
      let tracks = await this.getTracksByVolId(id);

      vol.tracks = tracks;
    }

    return vol || {};
  }

  async getTracksByVolId (id) {
    let sql = `SELECT * FROM ??  WHERE vol_id = ?`;
    let result = await this.app.mysql.query(sql, [this.tableTrack, id]);

    return result;
  }

  async getTags() {
    let sql = `SELECT tags FROM ?? `;
    let result = await this.app.mysql.query(sql, [this.tableVol]);

    console.log(result);

    return result;
  }

}

module.exports = MusicModel;

