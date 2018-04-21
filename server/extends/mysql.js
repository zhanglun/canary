const mysql = require('mysql');
const config = require('./config')();

class Model {
  constructor(app) {
    this.app = app;
    this.config = app.config.mysql;

    let {
      connectionLimit,
      host,
      port,
      user,
      password,
      database,
    } = this.config;

    this.pool = mysql.createPool({
      connectionLimit,
      host,
      port,
      user,
      password,
      database
    });
  }

  /**
   * 执行 SQL 语句
   * @param  {String} sql    [description]
   * @param  {Array} params [description]
   * @return {Promise}        [description]
   */
  async query(sql, params = []) {
    return new Promise((resolve, reject) => {
      sql = mysql.format(sql, params);

      if (this.config.debug) {
        this.app.logger.info({
          SQL: sql
        });
      }
      this.pool.query(sql, params, (err, result, fields) => {
        if (err) {
          reject(err);

          throw err;
        }

        resolve(result);
      });
    });
  }

}

module.exports = Model;
