const value = (v, d) => (v != null ? v : d)

export default function preset(context, opts = {}) {
  const env = process.env.BABEL_ENV || process.env.NODE_ENV
  const isEnvProduction = env === 'production'
  const isEnvTest = env === 'test'

  return {
    presets: [
      [
        require.resolve('@babel/preset-env'),
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
      require.resolve('@babel/preset-react'),
    ],
    plugins: [
      require.resolve('@babel/plugin-syntax-dynamic-import'),
      [require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
      [
        require.resolve('@babel/plugin-proposal-class-properties'),
        {
          loose: true,
        },
      ],
      require.resolve('@babel/plugin-transform-runtime'),
      isEnvProduction && [
        require.resolve('babel-plugin-transform-react-remove-prop-types'),
        {
          removeImport: true,
        },
      ],
    ].filter(Boolean),
  }
}
