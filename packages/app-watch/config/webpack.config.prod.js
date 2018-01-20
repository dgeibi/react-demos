const merge = require('webpack-merge')
const { uglifyJs } = require('./webpack.parts')

module.exports = merge([
  uglifyJs(),
])
