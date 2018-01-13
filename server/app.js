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

const Model = require('./models');
// const MusicModel = require('./models/luoo');

const app = new Koa();

app.use(views(path.join(__dirname, './views'), {
  extension: 'pug'
}));
app.use(static(path.resolve(__dirname, '../public')));
app.use(logger());
app.use(Router);

const luooModel = new Model(app);

// app.luooModel = luooModel;
// app.musicModel = new MusicModel(app);

const debug = process.NODE_ENV == 'production';

// const compiler = webpack(webpackConfig);
//
// app.use(webpackDevMiddleware(compiler, {
//   publichPath: webpackConfig.output.publichPath,
//   quite: false,
//   noInfo: false,
//   headers: { 'X-Custom-Header': 'yes', },
//   stats: {
//     colors: true,
//   },
// }));
// app.use(webpackHotMiddleware(compiler));

app.listen(3000, () => {
  console.log('Listen: -----> Canary listen at localhost:3000');
});
