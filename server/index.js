const app = require('./app');
const argv = require('yargs').argv
const port = argv.port || 8000;

app.listen(port, () => {
  app.logger.info(`listen ${port}`);
});
