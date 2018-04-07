#! /usr/bin/env node

const args = process.argv.slice(2)

const { spawn } = require('child_process')
const path = require('path')

spawn(
  'node',
  [
    require.resolve('poi/bin/cli.js'),
    ...args,
    '--config',
    path.join(__dirname, './poi.config.js'),
  ],
  {
    stdio: 'inherit',
  }
)
