const path = require('path');
const Koa = require('koa');
const static = require('koa-static');
const logger = require('koa-logger');
const views = require('koa-views');
const webpackDevMiddleware = require('koa-webpack-dev-middleware');
const webpackHotMiddleware = require('koa-webpack-hot-middleware');
const webpack = require('webpack');
const webpackConfig = require('../tools/webpack.dev.config');
const Router = require('./routers');

const app = new Koa();

app.use(views(path.join(__dirname, './views'), {
  extension: 'pug'
}));
app.use(static(path.resolve(__dirname, '../public')));
app.use(logger());
app.use(Router);

const debug = process.NODE_ENV == 'development';

if (debug) {
  const compiler = webpack(webpackConfig);

  app.use(webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    quite: false,
    noInfo: false,
    headers: { 'X-Custom-Header': 'yes', },
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
}

app.listen(3000, () => {
  console.log('Listen: -----> Canary listen at localhost:3000');
});
