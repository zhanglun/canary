const path = require('path');
const Koa = require('koa');
const KoaStatic = require('koa-static');
const views = require('koa-views');

const Router = require('./routers');

const webpackDevMiddleware = require('koa-webpack-dev-middleware');
const webpackHotMiddleware = require('koa-webpack-hot-middleware');
const webpack = require('webpack');
const webpackConfig = require('../tools/webpack.dev.config');

const app = new Koa();

app.use(views(path.join(__dirname, './views'), {
  extension: 'pug'
}))

app.use(KoaStatic(path.resolve(__dirname, '../public')));

// app.locals.debug = process.NODE_ENV == 'production';
app.use(Router);

const debug = process.NODE_ENV == 'production';


const compiler = webpack(webpackConfig);
app.use(webpackDevMiddleware(compiler, {
  publichPath: webpackConfig.output.publichPath,
  // filename: webpackConfig.output.filename,
  quite: false,
  noInfo: false,
  headers: { 'X-Custom-Header': 'yes' },
  stats: {
    colors: true
  }
}));
app.use(webpackHotMiddleware(compiler));

app.listen(3000, () => {
  console.log('Listen: ----->');
});
