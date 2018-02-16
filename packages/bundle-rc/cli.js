#! /usr/bin/env node

const mri = require('mri')
const bundle = require('.')

const uniq = x => (Array.isArray(x) ? [...new Set(x)] : [])

function getOpts(args, mriOpts, { array, single }) {
  const mout = mri(args, mriOpts)
  const opts = {}
  const has = Object.prototype.hasOwnProperty

  uniq(array).forEach(key => {
    if (Array.isArray(mout[key])) {
      opts[key] = mout[key]
    }
  })

  uniq(single).forEach(key => {
    if (!has.call(mout, key)) return
    const value = mout[key]
    if (Array.isArray(value)) {
      if (value[0]) {
        opts[key] = value[0]
      }
      return
    }
    opts[key] = value
  })

  return opts
}

const args = process.argv.slice(2)

const opts = getOpts(
  args,
  {
    boolean: ['watch', 'nosourcemap', 'clean'],
    string: ['cwd', 'output'],
    alias: {
      w: 'watch',
      c: 'cwd',
      _: 'entry',
      o: 'output',
    },
  },
  {
    single: ['cwd', 'watch', 'entry', 'output', 'nosourcemap', 'clean'],
  }
)

bundle(opts).catch(err => {
  console.error(err)
  process.exit(err.code || 1)
})
