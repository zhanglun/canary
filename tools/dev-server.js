const http = require('http');
const portfinder = require('portfinder');
const Express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require('./webpack.dev.config');
const app = require('../server/app');

console.log(app.config);

const compiler = webpack(webpackConfig);
const server = new Express();

server.use(webpackDevMiddleware(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quite: false,
  noInfo: false,
  headers: {
    'X-Custom-Header': 'yes',
  },
  stats: {
    colors: true,
  },
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
    ignored: [/node_modules/, /server/],
  },
}));

server.use(webpackHotMiddleware(compiler));

server.use((req, res, next) => {
  let headers = req.headers;
  let options = {
    path: req.url,
    host: 'localhost',
    port: app.config.port,
    headers,
    agent: new http.Agent(),
  };

  if (req.url.indexOf('api') != -1) {
    res.type('application/json');
  }

  const sreq = http.request(options, (sres) => {
    sres.pipe(res);
  });

  req.pipe(sreq);

})

portfinder.getPortPromise()
  .then((port) => {
    server.listen(port, () => {
      console.log(`Dev Server Listening at: http://localhost:${port}`);
    });
  });
