const config = {
  development: {
    mysql: {
      connectionLimit: 10,
      host: 'localhost',
      port: '',
      user: 'root',
      database: 'music',
    },
  },
  production: {
    mysql: {
      connectionLimit: 10,
      host: 'localhost',
      port: '',
      user: 'root',
      database: 'music',
    },
  },
};

module.exports = config;
