module.exports = {
  entry: 'src/index.js',
  html: {
    template: require.resolve('@dgeibi/poi-preset-react/template.html'),
  },
  vendor: false,
  clear: false,
  presets: [require('poi-preset-react')(), require('@dgeibi/poi-preset-react')()],
}
