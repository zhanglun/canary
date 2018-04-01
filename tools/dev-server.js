const http = require('http');
const Express = require('express');
const request = require('request');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require('./webpack.dev.config');
const compiler = webpack(webpackConfig);

const app = new Express();

app.use(webpackDevMiddleware(compiler, {
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

app.use(webpackHotMiddleware(compiler));

app.use((req, res, next) => {
  let options = {
    host: 'localhost',
    port: 3000,
    headers: req.headers,
    agent: new http.Agent(),
  };

  const sreq = http.request(options, (sres) => {
    // res.pipe(sres);
  });

  sreq.pipe(req);

})

app.listen(8000, () => {
  console.log('8000');
});
