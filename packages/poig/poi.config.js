const scripts = require('../../scripts.json')
const path = require('path')

module.exports = () => ({
  entry: [path.join(__dirname, 'polyfill.js'), `./src/index.js`],
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
