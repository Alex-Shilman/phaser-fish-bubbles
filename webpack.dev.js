const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

  module.exports = merge(common, {
    devtool: 'inline-source-map',
    devServer: {
      contentBase: './dist',
    },
    mode: 'development',
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Development-Fluency',
      }),
      new CopyPlugin({
        patterns: [
          { from: "src/assets", to: "dist" },
        ],
      }),
    ]
  });