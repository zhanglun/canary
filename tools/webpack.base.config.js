const path = require('path');
const AssetsPlugin = require('assets-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const publicPath = '/assets/';

module.exports = {
  entry: {
    vendor: ['vue', 'vue-router'],
    app: [path.resolve(__dirname, '../client/index.js')],
  },
  output: {
    path: path.resolve(__dirname, '../public/assets'),
    filename: '[name].[hash].js',
    publicPath: publicPath,
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
    ],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          name: 'vendor',
          filename: 'vendor.[hash].js',
        },
      },
    },
  },
  plugins: [
    new VueLoaderPlugin(),
    new AssetsPlugin({
      useCompilerPath: true,
      filename: 'assets.json',
    }),
  ],
  resolve: {
    extensions: ['.js', '.json', '.vue', '.css', '.less'],
    modules: [
      path.resolve(__dirname, '../', 'node_modules'),
      path.resolve(__dirname, '../', 'client'),
      path.resolve(__dirname, '../', 'public'),
    ],
    alias: {
      vue$: 'vue/dist/vue.js',
    },
  },
  mode: 'development',
};
