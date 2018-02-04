module.exports = {
  js: 'babel',
  babel: {
    runtimeHelpers: true,
  },
  filename: 'index[suffix].js',
  external: ['react', 'react-dom', 'babel-runtime'],
}
