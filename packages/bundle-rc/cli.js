#! /usr/bin/env node

const isWatch = String(process.argv[2]).trim() === '-w'
const bundle = require('.')

bundle(undefined, undefined, isWatch).catch(err => {
  console.error(err)
  process.exit(err.code || 1)
})
