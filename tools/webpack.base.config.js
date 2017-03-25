const path = require('path');
const webpack = require('webpack');
const AssetsJSONPlugin = require('assets-webpack-plugin');
const hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true';
const publicPath = 'http://localhost:3000/';

module.exports = {
  entry: {
    app: [path.resolve(__dirname, '../client/index.js'), hotMiddlewareScript],
  },
  output: {
    path: path.resolve(__dirname, '../public/assets'),
    filename: '[name].[hash].js',
    publicPath: publicPath,
  },
  module: {
    rules: [
      {
        test: /.(js|vue)$/,
        loader: 'babel-loader',
        query: {
          presets: 'es2015',
        }
      },
      {
        enforce: 'pre',
        test: /.vue$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      },
      // but use vue-loader for all *.vue files
      {
        test: /.vue$/,
        loader: 'vue-loader',
        include: [path.resolve(__dirname, '../client/')],
      },
    ]
  },
  resolve: {
    alias: {
      'vue': '../node_modules/vue/dist/vue.js',
    },
  },
  plugins: [
  ]
};
