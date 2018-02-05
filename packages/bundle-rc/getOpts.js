const babel = require('rollup-plugin-babel')
const postcss = require('rollup-plugin-postcss')
const fs = require('fs-extra')
const path = require('path')
const noop = require('no-op')

module.exports = ({ dirname, mainDest, moduleDest }, { onBuild = noop } = {}) => {
  let extractCSS = null
  const newOnBuild = async e => {
    if (extractCSS) {
      const bundle = extractCSS()
      extractCSS = null
      await writeCSS(bundle)
      console.log(bundle.codeFilePath)
    }
    return onBuild(e)
  }

  const outputOptions = [
    mainDest && {
      file: mainDest,
      format: 'cjs',
      strict: true,
      sourcemap: true,
    },
    moduleDest && {
      file: moduleDest,
      format: 'es',
      strict: true,
      sourcemap: true,
    },
  ].filter(Boolean)

  const inputOptions = {
    input: './src/index.js',
    plugins: [
      postcss({
        extract: `${dirname}/index.css`,
        onExtract: getExtracted => {
          extractCSS = getExtracted
          return false
        },
      }),
      babel({
        exclude: 'node_modules/**',
        runtimeHelpers: true,
      }),
    ],
    external: id => id[0] !== '.' && id[0] !== '/',
    onwarn({ loc, frame, message }) {
      if (loc) {
        console.warn(`${loc.file} (${loc.line}:${loc.column}) ${message}`)
        if (frame) console.warn(frame)
      } else {
        console.warn(message)
      }
    },
  }

  return {
    inputOptions,
    outputOptions,
    onBuild: newOnBuild,
  }
}

function writeCSS(bundle) {
  const { code, codeFilePath, map, mapFilePath } = bundle
  return fs
    .ensureDir(path.dirname(codeFilePath))
    .then(() =>
      Promise.all([
        fs.writeFile(codeFilePath, code, 'utf8'),
        fs.writeFile(mapFilePath, map, 'utf8'),
      ])
    )
}
