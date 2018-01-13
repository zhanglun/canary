const mysql = require('mysql');
const config = require('../config/config');
let { connectionLimit, host, user, password, database } = config.development.mysql;

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

  async query(sql) {
    return new Promise((resolve, reject) => {
      this.pool.query(sql, (err, result, fields) => {
        if (err) {
          reject(err);
        }

        resolve(result);
      });

    });
  }

}


module.exports = Model;
