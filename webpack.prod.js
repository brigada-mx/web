const webpack = require('webpack')
const merge = require('webpack-merge')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const common = require('./webpack.common.js')

if (process.env.NODE_ENV !== 'production') {
  throw new Error('Production builds must have NODE_ENV=production.')
}

module.exports = merge(common, {
  plugins: [
    new ExtractTextPlugin({
      filename: 'bundle.css',
      allChunks: true,
    }),
    new UglifyJSPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new webpack.DefinePlugin({
      'process.env.CUSTOM_GIT_COMMIT_HASH': JSON.stringify(process.env.CUSTOM_GIT_COMMIT_HASH),
    }),
  ],
})
