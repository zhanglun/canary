const mysql = require('mysql');
const Emitter = require('events');
const debug = require('debug')('canary');
const config = require('../config');
const logger = require('./logger');

class MySQLExtends extends Emitter {
  constructor() {
    super();

    this.config = config.mysql;
    this.logger = logger;

    const { host, user, database } = this.config;

    if (!(host && user && database)){
      const error = new Error(
        'MySQL required parameters: host, user, database.');

      error.code = 'MYSQL_OPTIONS_INVALID';

      throw error;
    }

    this.init();
  }

  init() {
    if (this.pool) {
      return;
    }

    const { host, port, user, password, database, connectionLimit} = this.config;

    this.pool = mysql.createPool({
      connectionLimit,
      host,
      port,
      user,
      password,
      database,
    });

    this.pool.on('error', (err) => {
      throw err;
    });

    this.check().then((flag) => {
      debug('mysql connect %s', flag);

      if (flag) {
        this.logger.info('MySQL: connect sucess.');
      }
    }, (err) => {
      this.logger.error('MySQL: %s', err);
    });

  }

  _check(){
    if (!this.pool){
      const error = new Error('MySQL is not initial');
      error.code = 'MYSQL_NOT_INITIAL';
      throw error;
    }
  }


  /**
   * 连接状态检查
   *
   * @returns
   */
  async check(){
    debug('checked');
    this._check();

    try {
      await this.pool.query('SELECT 1 + 1 AS solution');

      return true;
    } catch (err) {
      debug(err);

      if (this.retry <= 0){
        this.logger.error('MySQL: connect failure.');

        return false;
      }

      if (err.code === 'ECONNREFUSED'){
        // await sleep(this.retry_interval);

        this.init();
        this.retry -= 1;
        this.logger.warn('MySQL: %s', err.message);
        this.logger.warn('MySQL: connect retry %s', this.retry);

        return false;
      }

      this.emit('error', err);
    }
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
        this.logger.info({ SQL: sql });
      }

      this._check();

      this.pool.query(sql, params, (err, result, fields) => {
        if (err) {
          reject(err);

          this.logger.error(err);

          throw err;
        }

        resolve(result);
      });
    });
  }

}

module.exports = new MySQLExtends();
