
const runSequence = require('run-sequence');

module.exports = (gulp, common, plugins) => {
  gulp.task('release', (cb) => {
    runSequence('build', 'pack', cb);
  });
};
