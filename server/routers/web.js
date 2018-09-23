const debug = require('debug')('canary');
const path = require('path');
const Router = require('koa-router');
const { readFileSync } = require('fs');
const config = require('../config');

class Router {
  constructor() {
    this.config = config;

    return this.init();
  }

  getAssetsVersion() {
    const filename = path.join(__dirname, '../../public/assets/assets.json');
    const result = readFileSync(filename);
    const assets = JSON.parse(result.toString());

    return assets;
  }

  init() {
    const Router = require('koa-router');

    let router = new Router();

    router.get('/', async (ctx, next) => {
      console.log(123);
      const assetsVersion = this.getAssetsVersion();

      await ctx.render('index', {
        assetsVersion,
      });
    });

    return router;
  }
}

module.exports = Router;
