const gulp = require('gulp');
const config = require('./tools/gulp/gulp.config');
const $ = require('gulp-load-plugins')({lazy: true});
const args = require('yargs').argv;

async function init() {
  require('./tools/gulp/tasks/download')(gulp, config, $, args);
  require('./tools/gulp/tasks/build')(gulp, config, $, args);
  require('./tools/gulp/tasks/pack')(gulp, config, $, args);
}

init();

gulp.task('default', () => {
  console.log('Please select the command specified')
});
