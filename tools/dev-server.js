const webpack = require('webpack');
const webpackDevMiddleware = require('koa-webpack-dev-middleware');
const webpackHotMiddleware = require('koa-webpack-hot-middleware');
const app = require('../server/app');
const webpackConfig = require('./webpack.dev.config');
const compiler = webpack(webpackConfig);

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


app.listen(3000, () => {
  console.log('3000');
});
