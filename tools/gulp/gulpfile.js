const gulp = require('gulp');
const config = require('./gulp.config')();
const $ = require('gulp-load-plugins')({lazy: true});
const args = require('yargs').argv;

async function init() {
  await require('./tasks/build')(gulp, config, $, args);
  await require('./tasks/download')(gulp, config, $, args);
}

init();

gulp.task('default', () => {
  console.log('Please select the command specified')
});
