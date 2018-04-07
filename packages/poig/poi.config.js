const scripts = require('../../scripts.json')

module.exports = () => ({
  entry: [`./src/index.js`],
  html: {
    template: require.resolve('./template.html'),
    scripts,
  },
  hash: false,
  clearScreen: false,
  plugins: [require('./plugin')()],
  babel: {
    cacheDirectory: true,
  },
  // debugWebpack: true,
  postcss: {
    config: {
      path: `${__dirname}/postcss.config.js`,
    },
  },
})
