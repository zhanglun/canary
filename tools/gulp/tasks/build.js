const clean = require('gulp-clean');
const gulpSequence = require('gulp-sequence');
const webpack = require('webpack');
const webpackConfig = require('../../webpack.pro.config');

module.exports = async (gulp, config, plugins) => {

  gulp.task('build:clean', function(cb) {
    return gulp.src(config.distPath, { read: false })
      .pipe(clean());
  });

  gulp.task('build:client', ['build:clean'], (callback) => {
    console.log('build:client start');
    webpack(webpackConfig, (err, stats) => {
      if(err) {
        throw new Error("webpack:build", err);
      }

      stats.toString({
          colors: true
      });

      return gulp.src(config.publicPath + '/**/*', {base: '.'})
        .pipe(gulp.dest(config.distPath));

      callback();
    });
  });

  gulp.task('build:server', ['build:clean'], (cb) => {
    console.log('build:server');
    return gulp.src([config.serverPath + '/**/*', config.pkgPath], {base: '.'})
    .pipe(gulp.dest(config.distPath));
  });


  gulp.task('build', gulpSequence([ 'build:client', 'build:server' ]));
};
