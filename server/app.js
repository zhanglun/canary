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

app.use(async (ctx, next) => {
  // ctx.set('Content-Type', 'application/json');
  await next();
});
app.use(views(path.join(__dirname, './views'), {
  extension: 'pug'
}));
app.use(static(path.resolve(__dirname, '../public')));
app.use(logger());
app.use(Router);

app.use(async (ctx, next) => {
  let body = ctx.body;

  ctx.body = {
    code: 0,
    message: 'ok',
    data: body,
  };
});

// const debug = process.NODE_ENV == 'development';
const debug = true;

//
// app.use(async (ctx, next) => {
//   //will log the error as `InternalServerError: Error Message` and will return `Internal Server Error` as the response body
//   ctx.throw(200, 'Error Message', { message:  JSON.stringify({data: 'Not Found!'})});
// });

app.on('error', err => {
  console.log('server error', err)
});

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
