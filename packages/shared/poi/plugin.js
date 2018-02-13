module.exports = () => poi => {
  poi.extendWebpack((config, { command }) => {
    if (command === 'develop') {
      config.set('devtool', 'cheap-module-source-map')
    } else if (command === 'build') {
      const output = config.get('output') || {}
      output.publicPath = ''
      config.set('output', output)
      config.set('externals', {
        react: 'React',
        'react-dom': 'ReactDOM',
      })
    }
  })
}
