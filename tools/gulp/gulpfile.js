const gulp = require('gulp');
const config = require('./gulp.config')();
const $ = require('gulp-load-plugins')({lazy: true});
const args = require('yargs').argv;

require('./tasks/js.task')(gulp, config, $, args);
