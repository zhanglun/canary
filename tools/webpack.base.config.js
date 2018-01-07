const path = require('path');
const webpack = require('webpack');
const AssetsJSONPlugin = require('assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
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
        },
        exclude: '/node_modules/',
      },
      {
        enforce: 'pre',
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        exclude: [path.resolve(__dirname, '../node_modules/')],
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        include: [path.resolve(__dirname, '../client/'), 'node_modules/vue-monaco-editor'],
      },
    ]
  },
  resolve: {
    alias: {
      'vue': path.resolve('node_modules', 'vue/dist/vue.js'),
    },
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: 'node_modules/monaco-editor/min/vs',
        to: 'vs',
      }
    ])
  ]
};
