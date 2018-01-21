const path = require('path')

module.exports = {
  entry: 'src/index.js',
  html: {
    template: path.resolve('public', 'index.html')
  },
  staticFolder: 'public',
  clear: false,
  presets: [
    require('poi-preset-react')(),
    require('@dgeibi/poi-preset-react')(),
  ]
}
