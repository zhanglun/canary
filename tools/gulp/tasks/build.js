const babel = require('gulp-babel');
const runSequence = require('run-sequence');
const webpack = require('webpack-stream');
const webpackCofnig = require('../../webpack.pro.config.js');

module.exports = (gulp, common, plugins) => {
  const { root } = common.build;

  gulp.task('build:client', () => {
    return gulp
      .src(`${root}/client/index.js`)
      .pipe(webpack(webpackCofnig))
      .pipe(gulp.dest(`${root}/public/assets`));
  });

  gulp.task('build:copy', () => {
    return gulp
      .src(
        [`${root}/public/**`, `${root}/package.json`, `${root}/control.sh`, `${root}/server/**/*`],
        { base: `${root}` },
      )
      .pipe(gulp.dest('dist'));
  });

  gulp.task('build:server', ['build:copy'], () => {
    return gulp
      .src(`${root}/server/**/*.js`)
      .pipe(
        babel({
          presets: ['env'],
          plugins: [
            'transform-object-rest-spread',
            'transform-runtime',
            'transform-decorators-legacy',
          ],
        }),
      )
      .pipe(gulp.dest('dist/server'));
  });

  /**
   * 打包项目
   */
  gulp.task('build', (cb) => {
    runSequence(
      'clean',
      'build:client',
      'build:copy',
      'build:downloadNode',
      'build:extractNode',
      cb,
    );
  });
};
