/* eslint-disable global-require */
const merge = require('webpack-merge')

module.exports = (env = {}) => {
  process.env.NODE_ENV = env.production ? 'production' : 'development'

  if (env.production) {
    return merge([require('./config/webpack.config.base'), require('./config/webpack.config.prod')])
  }
  return merge([require('./config/webpack.config.base'), require('./config/webpack.config.dev')])
}
