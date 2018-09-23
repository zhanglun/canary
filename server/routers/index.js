const debug = require('debug')('cancay');
const path = require('path');
const glob = require('glob');
const router = require('koa-router')();
const { readFileSync } = require('fs');

const getAssetsVersion = () => {
  const filename = path.join(__dirname, '../public/assets/assets.json');
  const result = readFileSync(filename);
  const assets = JSON.parse(result.toString());

  return assets;
};

const ROUTE_PATH = path.join(__dirname, './');
const modules = ['lianjia'];
const src = `${ROUTE_PATH}/**/@(${modules.join('|')}).js`;

router.get('/', async(ctx, next) => {
  console.log(123);
  const assetsVersion = getAssetsVersion();

  await ctx.render('index', {
    assetsVersion,
  });
});

glob(src, {}, (err, files) => {
  debug('LOAD_ROUTER', files);

  if (err) {
    throw err;
  }

  files.forEach((file) => {
    console.log(file);
    const ModuleRouter = require(file);
    const moduleRouter = new ModuleRouter();

    router.use('/api', moduleRouter.routes());
  });
});



module.exports = router.routes();
