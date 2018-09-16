const path = require('path');
const Koa = require('koa');
const koaStatic = require('koa-static');
const bodyParser = require('koa-bodyparser');
const views = require('koa-views');
const Router = require('./router');
const moduleLoader = require('./loader/router');
const appExtends = require('./extends');

const app = new Koa();

app.root = path.resolve(__dirname, '../');

appExtends(app);

app.use(views(path.join(__dirname, './views'), {
  extension: 'pug'
}));
app.use(koaStatic(path.resolve(__dirname, '../public')));
app.use(bodyParser());
app.use(moduleLoader(app));
app.use(Router);

app.use(async(ctx, next) => {
  app.logger.info('Middleware: test');
});

app.on('error', err => {
  console.log('server error', err)
});

module.exports = app;
