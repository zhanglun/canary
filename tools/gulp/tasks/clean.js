const fs = require('fs');
const rm = require('rimraf');
const runSequence = require('run-sequence');

module.exports = (gulp, common, plugins) => {
  const { root } = common.build;

  gulp.task('clean:build', (cb) => {
    rm(`${root}/build`, (err) => {
      if (err) {
        throw err;
      }

      cb();
    });
  });

  gulp.task('clean:target', (cb) => {
    rm(`${root}/target`, (err) => {
      if (err) {
        throw err;
      }

      cb();
    });
  });

  gulp.task('clean:dist', (cb) => {
    rm(`${root}/dist`, (err) => {
      if (err) {
        throw err;
      }

      cb();
    });
  });

  gulp.task('clean', (cb) => {
    runSequence('clean:build', 'clean:target', 'clean:dist', cb);
  });
};
