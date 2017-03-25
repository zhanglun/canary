const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const AssetsJSONPlugin = require('assets-webpack-plugin');
const hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true';
const publicPath = 'http://localhost:3000/';
const webpackBase = require('./webpack.base.config');

const webpackDev = webpackMerge(webpackBase, {
  devtool: 'eval',
  // sourceMap: 'eval',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.HashedModuleIdsPlugin(),
    new AssetsJSONPlugin({ filename: 'assets.json', path: path.resolve(__dirname, '../public') }),
  ],
});

module.exports = webpackDev;
