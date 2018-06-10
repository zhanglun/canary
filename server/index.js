const os = require('os');
const cluster = require('cluster');
const argv = require('yargs').argv

const app = require('./app');
const port = argv.port || 8888;
const numCPUs = os.cpus().length;

if (app.config.enableCluster) {
  if (cluster.isMaster) {
    app.logger.info('[master] start...');

    for(let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on('fork', function(worker) {
      app.logger.info(`[master] fork: worker pid: ${worker.process.pid}`);
    });

    cluster.on('online', function(worker) {
      app.logger.info('[master] online: worker ', worker.process.pid);
    });


    cluster.on('listening', (worker, address) => {
      app.logger.info(
        '[master] listening: worker ',
        worker.id,
        ' pid: ',
        worker.process.pid,
      );
    });

    cluster.on('disconnect', function(worker) {
      app.logger.error(`[master] disconnect: worker ${worker.id}, pid:${worker.process.pid}`);
      cluster.fork();
    });

    cluster.on('exit', function(worker, code, signal) {
      app.logger.error(`[master] exit worker: ${worker.id} died pid: ${worker.process.pid} code: ${code} singal: ${signal}`);
      cluster.fork();
      app.logger.info('[master] worker restrating...');
    });
  } else {
    app.listen(port, () => {
      app.logger.info(`listen ${port}`);
    });
  }
}
