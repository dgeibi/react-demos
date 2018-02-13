module.exports = () => ({
  entry: ['./src/index.js'],
  html: {
    template: require.resolve('./template.html'),
  },
  vendor: false,
  clear: false,
  plugins: [require('./plugin')()],
  babel: {
    cacheDirectory: true,
  },
})
