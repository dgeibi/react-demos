const env = process.env.BABEL_ENV || process.env.NODE_ENV

module.exports = {
  presets: [
    [
      require.resolve('babel-preset-env'),
      env === 'test'
        ? {
            targets: {
              node: 'current',
            },
          }
        : {
            targets: {
              ie: 9,
            },
            modules: false,
          },
    ],
    require.resolve('babel-preset-react'),
    require.resolve('babel-preset-stage-2'),
  ],
  plugins: [require.resolve('babel-plugin-transform-runtime')],
}
