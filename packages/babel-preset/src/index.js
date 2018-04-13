const value = (v, d) => (v != null ? v : d)

export default function preset(context, opts = {}) {
  const env = process.env.BABEL_ENV || process.env.NODE_ENV
  const isEnvProduction = env === 'production'
  const isEnvTest = env === 'test'

  return {
    presets: [
      [
        require('@babel/preset-env').default,
        {
          debug: opts.debug,
          useBuiltIns: opts.useBuiltIns,
          modules: value(opts.modules, isEnvTest ? 'commonjs' : false),
          shippedProposals: value(opts.shippedProposals, true),
          targets: value(
            opts.targets,
            isEnvTest
              ? {
                  node: 'current',
                }
              : {
                  ie: 10,
                }
          ),
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
      require('@babel/plugin-transform-runtime').default,
      isEnvProduction && [
        require('babel-plugin-transform-react-remove-prop-types').default,
        {
          removeImport: true,
        },
      ],
    ].filter(Boolean),
  }
}
