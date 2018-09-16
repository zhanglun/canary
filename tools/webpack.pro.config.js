
const merge = require('webpack-merge');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const baseWebpackConfig = require('./webpack.base.config');
const argv = require('yargs').argv;

let plugins = [];

if(argv.showBundleAnalyzer) {
  plugins.push(new BundleAnalyzerPlugin());
}

module.exports = merge(baseWebpackConfig, {
  mode: 'production',
  plugins,
});
