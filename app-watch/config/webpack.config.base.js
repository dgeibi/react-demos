const { resolve, join } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

const pkg = require('../package.json')

const root = resolve(__dirname, '..')
const srcPath = join(root, 'src')
const outputPath = join(root, 'build')

module.exports = {
  entry: [join(srcPath, 'index.js')],
  output: {
    path: outputPath,
    filename: 'bundle.js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [srcPath],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: pkg.name,
      template: join(srcPath, 'index.ejs'),
    }),
    new webpack.EnvironmentPlugin(['NODE_ENV']),
  ],
}
