module.exports = {
  entry: 'src/index.js',
  html: {
    template: require.resolve('./template.html'),
  },
  vendor: false,
  clear: false,
  presets: [require('poi-preset-react')(), require('./preset')()],
  babel: {
    cacheDirectory: true,
  },
}
