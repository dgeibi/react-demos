module.exports = () => poi => {
  poi.extendWebpack((config, { command }) => {
    if (command === 'develop') {
      dev(config)
    } else if (command === 'build') {
      prod(config)
    }
  })
}

function prod(config) {
  config.set('output.publicPath', '')
  config.append('externals', {
    react: 'React',
    'react-dom': 'ReactDOM',
  })
}

function dev(config) {
  config.set('devtool', 'cheap-module-source-map')
}
