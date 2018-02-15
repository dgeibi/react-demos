module.exports = () => ({
  entry: ['./src/index.js'],
  html: {
    template: require.resolve('./template.html'),
  },
  vendor: false,
  clearScreen: false,
  plugins: [require('./plugin')()],
  babel: {
    cacheDirectory: true,
  },
})
