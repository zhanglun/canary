const debug = require('debug')('canary');
const path = require('path');
const glob = require('glob');
const router = require('koa-router')();
const { readFileSync } = require('fs');

const getAssetsVersion = () => {
  const filename = path.join(__dirname, '../../public/assets/assets.json');
  const result = readFileSync(filename);
  const assets = JSON.parse(result.toString());

  return assets;
};

const ROUTE_PATH = path.join(__dirname, './');
const modules = ['lianjia'];
const src = `${ROUTE_PATH}/**/@(${modules.join('|')}).js`;

router.get('/', async(ctx, next) => {
  const assetsVersion = getAssetsVersion();

  await ctx.render('index', {
    assetsVersion,
  });
});

const files = glob.sync(src, {});

debug('LOAD_ROUTER', files);

files.forEach((file) => {
  console.log(file);
  const ModuleRouter = require(file);
  const moduleRouter = new ModuleRouter();

  router.use('/api', moduleRouter.routes());
});

module.exports = router.routes();
