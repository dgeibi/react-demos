const merge = require('webpack-merge')
const { devServer } = require('./webpack.parts')

const outputPath = require('./webpack.config.base').output.path

module.exports = merge([
  devServer({ contentBase: outputPath }),
])
