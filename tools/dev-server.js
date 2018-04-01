const http = require('http');
const Koa = require('koa');
const request = require('request');
const webpack = require('webpack');
const webpackDevMiddleware = require('koa-webpack-dev-middleware');
const webpackHotMiddleware = require('koa-webpack-hot-middleware');
const webpackConfig = require('./webpack.dev.config');
const compiler = webpack(webpackConfig);

const app = new Koa();

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

app.use(async(ctx, next) => {
  console.log(ctx.request.url);
  console.log(ctx.request.path);
  console.log(ctx.request.headers);
  console.log(ctx.response.body);
  let headers = Object.assign({}, ctx.request.headers, {
    host: 'localhost:3000',
  });
  let options = {
    host: 'localhost',
    url: `http://localhost:3000${ctx.request.path}`,
    headers: headers,
  };

  console.log(options);
  ctx.body = ctx.req.pipe(request(options));

})

app.listen(8000, () => {
  console.log('8000');
});
