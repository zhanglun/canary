const path = require('path');
const Koa = require('koa');
const koaStatic = require('koa-static');
const views = require('koa-views');
const Router = require('./routers');
const appExtends = require('./extends');

const app = new Koa();

appExtends(app);

app.use(views(path.join(__dirname, './views'), {
  extension: 'pug'
}));
app.use(koaStatic(path.resolve(__dirname, '../public')));
app.use(Router);

app.use(async(ctx, next) => {
  app.logger.info('test');
});

app.on('error', err => {
  console.log('server error', err)
});

module.exports = app;
