const { rollup, watch } = require('rollup')
const path = require('path')
const fs = require('fs-extra')
const noop = require('no-op')

const getRollupOptions = require('./getRollupOptions')

module.exports = function bundleRC(opts) {
  const options = normalizeOpts(opts, {
    cwd: '',
    output: 'dist',
    entry: './src/index.js',
    onBuild: noop,
  })

  options.cwd = path.resolve(process.cwd(), options.cwd)
  const { cwd } = options

  if (options.clean) {
    fs.emptyDirSync(path.join(cwd, options.output))
  }

  const { onBuild, inputOptions, outputOptions } = getRollupOptions(options)

  if (options.watch) {
    return new Promise((resolve, reject) => {
      watch(
        Object.assign(
          {
            watch: {
              exclude: '**/node_modules/**',
              chokidar: true,
            },
            output: outputOptions,
          },
          inputOptions
        )
      ).on('event', async e => {
        if (e.code === 'ERROR' || e.code === 'FATAL') {
          reject(e.error)
          return
        }
        if (e.code === 'END') {
          printInfo(outputOptions)
          try {
            onBuild()
          } catch (err) {
            reject(err)
          }
        }
      })
    })
  }

  return rollup(inputOptions)
    .then(bundle => Promise.all(outputOptions.map(output => bundle.write(output))))
    .then(() => onBuild())
    .then(() => printInfo(outputOptions))
}

function printInfo(outputOptions) {
  console.log(outputOptions.map(x => normalizePath(x.file)).join('\n'))
}

function normalizePath(filepath) {
  return path.relative(process.cwd(), filepath)
}

function normalizeOpts(opts, defaults) {
  const newOpts = Object.assign({}, opts)

  Object.keys(defaults).forEach(key => {
    if (newOpts[key] === undefined) {
      newOpts[key] = defaults[key]
    }
  })

  return newOpts
}
