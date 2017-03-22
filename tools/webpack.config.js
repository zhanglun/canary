const path = require('path');
const webpack = require('webpack');
const AssetsJSONPlugin = require('assets-webpack-plugin');
const hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true';
const publicPath = 'http://localhost:3000';

module.exports = {
  entry: {
    app: [path.resolve(__dirname, '../client/index.js'), hotMiddlewareScript],
  },
  output: {
    path: path.resolve(__dirname, '../public/assets'),
    filename: './[name].[hash].js',
    publicPath: publicPath,
  },
  module: {
    rules: [
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.HashedModuleIdsPlugin(),
    new AssetsJSONPlugin({filename: 'assets.json', path: path.resolve(__dirname, '../public') }),
  ]
};
