const debug = require('debug')('hybrid');
const path = require('path');
const glob = require('glob');
const router = require('koa-router')();
const MODULE_PATH = path.join(__dirname, '../modules');

function loadRouter(app) {
  // const src = `${MODULE_PATH}/**/@(${moduleNames.join('|')}).router.js`;
  const src = `${MODULE_PATH}/**/*.router.js`;

  glob(src, {}, (err, files) => {
    debug('LOAD_ROUTER', files);

    if (err) {
      throw err;
    }

    files.forEach((file) => {
      const ModuleRouter = require(file);
      const moduleRouter = new ModuleRouter(app);

      router.use('/api', moduleRouter.routes());
    });
  });

  return router.routes();
}

module.exports = loadRouter;
