export default function preset() {
  const env = process.env.BABEL_ENV || process.env.NODE_ENV
  const isEnvProduction = env === 'production'
  const isEnvTest = env === 'test'

  return {
    presets: [
      [
        require('@babel/preset-env').default,
        isEnvTest
          ? {
              shippedProposals: true,
              targets: {
                node: 'current',
              },
            }
          : {
              modules: false,
              shippedProposals: true,
              targets: {
                ie: 10,
              },
            },
      ],
      require('@babel/preset-react').default,
    ],
    plugins: [
      require('babel-plugin-transform-decorators-legacy').default,
      [
        require('@babel/plugin-proposal-class-properties').default,
        {
          loose: true,
        },
      ],
      [
        require('@babel/plugin-transform-runtime').default,
        {
          helpers: true,
          polyfill: false,
          regenerator: true,
        },
      ],
      isEnvProduction && [
        require('babel-plugin-transform-react-remove-prop-types').default,
        {
          removeImport: true,
        },
      ],
    ].filter(Boolean),
  }
}
