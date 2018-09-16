const fs = require('fs');
const gulp = require('gulp');
const runSequence = require('run-sequence');
const gulpLoadPlugins = require('gulp-load-plugins');
const argv = require('yargs').argv;
const config = require('./tools/gulp/gulp.config')();

const plugins = gulpLoadPlugins({});
const taskPath = './tools/gulp/tasks';

config.argv = argv;

function walkTask(path) {
  fs.readdirSync(path).forEach((item) => {
    if (fs.statSync(path + '/' + item).isDirectory()) {
      walkTask(path + '/' + item);
    } else {
      console.log('Loading Tasks:', item);
      if (item.match(/js$/)) {
        require(`${path}/${item}`)(gulp, config, plugins);
      }
    }
  });
}

walkTask(taskPath);

const $ = require('gulp-load-plugins')({ lazy: true });
const args = require('yargs').argv;

gulp.task('default', () => {
  console.log('Please select the command specified');
});
