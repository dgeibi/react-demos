const path = require('path')
const webpack = require('webpack')
const pkg = require('./package.json')

process.env.NODE_ENV = 'production'

module.exports = {
  entry: path.resolve(__dirname, pkg.entry),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    libraryTarget: 'umd',
    library: {
      root: pkg.globalName,
      amd: pkg.name,
      commonjs: pkg.name,
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [{ loader: 'babel-loader' }],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              minimize: true,
            },
          },
        ],
      },
    ],
  },
  externals: {
    react: {
      commonjs: 'react',
      commonjs2: 'react',
      root: 'React',
    },
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
      comments: false,
      'screw-ie8': true,
    }),
    new webpack.EnvironmentPlugin(['NODE_ENV']),
  ],
}
