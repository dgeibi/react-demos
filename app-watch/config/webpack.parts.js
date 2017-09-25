const webpack = require('webpack')

module.exports = {
  devServer: (opts) => {
    const serverOpts = Object.assign({
      hot: true,
      open: true,
    }, opts)

    return {
      devServer: serverOpts,
      plugins: [
        new webpack.HotModuleReplacementPlugin(),
      ],
    }
  },
  uglifyJs: () => ({ plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
      comments: false,
      'screw-ie8': true,
    }),
  ] }),
}
