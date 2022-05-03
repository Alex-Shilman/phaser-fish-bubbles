const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

  module.exports = merge(common, {
    devtool: 'source-map',
    mode: 'production',
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Production-Fluency',
      }),
      new CopyPlugin({
        patterns: [
          { from: "src/assets", to: "" },
        ],
      }),
    ]
  });