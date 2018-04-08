const router = require('koa-router')();
const path = require('path');
const { readFileSync } = require('fs');

const musicRouter = require('./music');

const getAssetsVersion = () => {
  const filename = path.join(__dirname, '../../public/assets.json');
  const result = readFileSync(filename);
  const assets = JSON.parse(result.toString());

  return assets;
};

router.get('/', async(ctx, next) => {
  const assetsVersion = getAssetsVersion();

  await ctx.render('index', {
    assetsVersion,
  });
});

router.use('/api', musicRouter.routes());

module.exports = router.routes();
