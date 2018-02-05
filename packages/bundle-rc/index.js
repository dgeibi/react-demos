const { rollup, watch } = require('rollup')
const path = require('path')
const fs = require('fs-extra')
const noop = require('no-op')

const getOpts = require('./getOpts')

module.exports = function r(opts = {}) {
  const cwd = path.resolve(process.cwd(), opts.cwd || '')
  const meta = getMeta(cwd, opts)
  const { onBuild = noop, inputOptions, outputOptions } = getOpts(meta, opts)

  if (opts.watch) {
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
          reject(e)
          return
        }
        if (e.code === 'END') {
          printInfo(outputOptions)
          try {
            onBuild(e)
          } catch (err) {
            reject(err)
          }
        }
      })
    })
  }

  return Promise.all(
    outputOptions.map(output => rollup(inputOptions).then(bundle => bundle.write(output)))
  )
    .then(onBuild)
    .then(() => printInfo(outputOptions))
}

function printInfo(outputOptions) {
  console.log(outputOptions.map(x => normalizePath(x.file)).join('\n'))
}

function normalizePath(filepath) {
  return path.relative(process.cwd(), filepath)
}

function isFile(p) {
  try {
    return fs.statSync(p).isFile()
  } catch (e) {
    return false
  }
}

function getPkg(cwd) {
  fs.ensureDirSync(cwd)
  const pkgdir = path.join(cwd, 'package.json')
  if (isFile(pkgdir)) return JSON.parse(fs.readFileSync(pkgdir))
  return getFallbackPkg(cwd)
}

function getFallbackPkg(cwd) {
  const name = path
    .basename(cwd)
    .trim()
    .toLowerCase()
    .replace(/\s/g, '-')
  return { name }
}

function getMeta(cwd, { output = 'dist' }) {
  const pkg = getPkg(cwd)
  const mainDest = path.join(cwd, pkg.main || `${output}/index.js`)
  const moduleDest = path.join(cwd, pkg.module || `${output}/index.es.js`)

  return {
    cwd,
    pkg,
    dirname: path.dirname(mainDest),
    mainDest,
    moduleDest,
  }
}
