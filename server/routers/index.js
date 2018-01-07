const router = require('koa-router')();
const path = require('path');
const { readFileSync } = require('fs');

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

router.get('/api', async(ctx, next) => {
	const result = {name: '123'};
  
	ctx.body = result;
});

module.exports = router.routes();
