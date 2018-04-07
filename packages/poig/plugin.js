module.exports = () => poi => {
  poi.extendWebpack((config, { command }) => {
    config.merge({
      optimization: {
        splitChunks: {
          chunks: 'async',
        },
        runtimeChunk: undefined,
      },
    })

    if (command === 'develop') {
      dev(config)
    } else if (command === 'build') {
      prod(config)
    }
  })
}

function prod(config) {
  config.output.publicPath('')
  config.externals({
    react: 'React',
    'react-dom': 'ReactDOM',
  })
}

function dev(config) {
  config.devtool('cheap-module-source-map')
}
