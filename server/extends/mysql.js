const mysql = require('mysql');
const config = require('./config')();
const pool = mysql.createPool(config.mysql);

class Model {
  constructor(app) {
    this.app = app;
    this.pool = pool;
  }

  /**
   * 执行 SQL 语句
   * @param  {String} sql    [description]
   * @param  {Array} params [description]
   * @return {Promise}        [description]
   */
  async query(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.pool.query(sql, params, (err, result, fields) => {
        if (err) {
          reject(err);

          throw err;
        }

        resolve(result);
      });

      this.app.logger.info('SQL: ', sql);
    });
  }

}

module.exports = Model;
