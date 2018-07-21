
module.exports = async (gulp, config, plugins) => {

  gulp.task('pack:merge', (cb) => {
    console.log('start merge');
  });

  gulp.task('pack:compress', (cb) => {
    console.log('compress');
    cb();
  });

  gulp.task('pack:release', (cb) => {
    console.log('release');
    cb();
  });

  gulp.task('pack', [ 'pack:merge', 'pack:compress', 'pack:release' ], (cb) => {
    cb();
  })
};
