const Path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const Pages = require("./pages.config");

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  entry: Pages.reduce((config, page) => {
    config[page.entryName] = Path.resolve(__dirname, `../src/${page.entryPath}`);
    return config;
  }, {}),
  output: {
    path: Path.join(__dirname, '../dist'),
    filename: 'assets/js/[name].[contenthash].js',
    clean: true
  },
  devtool: isProd ? false : 'source-map',
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 0,
      cacheGroups: {
        common_vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'common_vendors',
          chunks: 'initial',
          enforce: true,
        },
      },
    },
  },
  plugins: [
    ...Pages.map( (page) =>
        new HtmlWebpackPlugin({
          inject: false,
          title: page.title,
          template: page.template,
          filename: `${page.filename}.html`,
          minify: isProd ? {
            removeComments: true,
            collapseWhitespace: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
            removeStyleLinkTypeAttributes: true,
            keepClosingSlash: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true,
          } : false
        })
    )
  ],
  resolve: {
    alias: {
      '~': Path.resolve(__dirname, '../src'),
    },
  },
  module: {
    rules: [
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto',
        },
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
              loader: 'babel-loader',
              options: {
                  presets: ['@babel/preset-env'],
                  plugins: ['@babel/plugin-transform-runtime'],
              }
          }
        },
        {
          test: /\.(html)$/i,
          loader: "html-loader",
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: { sourceMap: !isProd },
            },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [
                    require('autoprefixer')(),
                    ...(isProd ? [require('cssnano')()] : []),
                  ],
                },
                sourceMap: !isProd,
              },
            },
            {
              loader: 'sass-loader',
              options: { sourceMap: !isProd },
            },
          ],
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'assets/fonts/[name].[hash][ext][query]'
          }
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'assets/images/[name][ext][query]'
          }
        },
    ],
  },
};