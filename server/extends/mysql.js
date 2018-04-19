const mysql = require('mysql');
const config = require('./config')();
const pool = mysql.createPool(config.mysql);

class Model {
  constructor() {
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
        console.log(arguments);
        if (err) {
          reject(err);

          throw err;
        }

        resolve(result);
      });

      console.log('SQL: ', sql);
    });
  }

}

module.exports = Model;
