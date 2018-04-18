const mysql = require('mysql');

class Model {
  constructor(config) {
    let {
      connectionLimit,
      host,
      user,
      password,
      database
    } = config;

    this.pool = mysql.createPool({
      connectionLimit,
      host,
      user,
      password,
      database,
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
      this.pool.query(sql, params, (err, result, fields) => {
        console.log(arguments);
        if (err) {
          reject(err);

          throw err;
        }

        return resolve(result);
      });

      console.log('SQL: ', sql);
    });
  }

}


module.exports = Model;
