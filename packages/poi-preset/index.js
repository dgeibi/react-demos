module.exports = () => poi => {
  poi.extendWebpack('development', config => {
    config.devtool('cheap-module-source-map')
  })
  poi.extendWebpack('production', config => {
    config.output.publicPath('')
  })
}
