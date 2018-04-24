const webpack = require('webpack')
const path = require('path')
const merge = require('webpack-merge')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const common = require('./webpack.common.js')

module.exports = merge(common, {
  devtool: 'inline-source-map',
  plugins: [
    new ExtractTextPlugin({
      filename: 'bundle.css',
      allChunks: true,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    new webpack.DefinePlugin({
      'process.env.CUSTOM_GIT_COMMIT_HASH': JSON.stringify(process.env.CUSTOM_GIT_COMMIT_HASH),
    }),
  ],
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    historyApiFallback: true,
  },
})
