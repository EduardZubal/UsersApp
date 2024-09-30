const Path = require('path');
const Webpack = require('webpack');
const { merge } = require('webpack-merge');
const ESLintPlugin = require('eslint-webpack-plugin');
const common = require('./webpack.common.js');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const PORT = 9000;

module.exports = merge(common, {
  target: 'web',
  mode: 'development',
  devtool: 'eval-cheap-source-map',
  output: {
    chunkFilename: 'assets/js/[name].chunk.js',
    publicPath: `http://localhost:${PORT}/`,
  },
  devServer: {
    static: {
      directory: Path.resolve(__dirname, '../src'),
    },
    hot: true,
    client: {
        overlay: true,
    },
    compress: true,
    port: PORT,
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new Webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    new ESLintPlugin({
      extensions: 'js',
      emitWarning: true,
      files: Path.resolve(__dirname, '../src'),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.js$/,
        include: Path.resolve(__dirname, '../src'),
        loader: 'babel-loader',
      },
      {
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false,
        },
        use: 'babel-loader',
      },
    ],
  },
});