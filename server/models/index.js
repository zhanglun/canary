const mysql = require('mysql');
const config = require('../config/config');
let {
  connectionLimit,
  host,
  user,
  password,
  database
} = config.development.mysql;

const pool = mysql.createPool({
  connectionLimit,
  host,
  user,
  password,
  database,
});

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
      let query = this.pool.query(sql, params, (err, result, fields) => {
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
