const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true';
const webpackBase = require('./webpack.base.config');

Object.keys(webpackBase.entry).forEach((k) => {
  webpackBase.entry[k].push(hotMiddlewareScript);
});

const webpackDev = webpackMerge(webpackBase, {
  devtool: 'inline-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin({multiStep: true}),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
});

module.exports = webpackDev;
