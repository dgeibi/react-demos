module.exports = () => poi => {
  poi.extendWebpack('development', config => {
    config.devtool('cheap-module-source-map')
  })
  poi.extendWebpack('production', config => {
    config.output.publicPath('')
    config.externals({
      react: 'React',
      'react-dom': 'ReactDOM',
    })
  })
}
