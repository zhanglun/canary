const path = require('path');
const Koa = require('koa');
const koaStatic = require('koa-static');
const bodyParser = require('koa-bodyparser');
const views = require('koa-views');
const router = require('./routers');
const logger = require('./extends/logger');
const config = require('./config');
const lianjiaQueryMiddleware = require('./middlewares/lianjia-querys');

const app = new Koa();

app.root = path.resolve(__dirname, '../');

app.logger = logger;
app.config = config;

app.use(views(path.join(__dirname, './views'), {
  extension: 'pug'
}));
app.use(koaStatic(path.resolve(__dirname, '../public')));
app.use(bodyParser());
app.use(lianjiaQueryMiddleware());

app.use(router);

app.use(async(ctx, next) => {
  const start = new Date().getTime();
  await next();
  const ms = new Date().getTime() - start;

  ctx.set('X-Response-Time', `${ms}ms`)
});

app.use(async(ctx, next) => {
  app.logger.info('Middleware: test');
  app.logger.info('url: ', ctx.request.method, ctx.url);
});

app.on('error', err => {
  console.log('server error', err)
});

module.exports = app;
