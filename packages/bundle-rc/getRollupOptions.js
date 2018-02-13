const babel = require('rollup-plugin-babel')
const postcss = require('rollup-plugin-postcss')
const fs = require('fs-extra')
const path = require('path')

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

function getMeta({ output, cwd }) {
  const pkg = getPkg(cwd)
  const mainDest = path.join(cwd, pkg.main || `${output}/index.js`)
  const moduleDest = path.join(cwd, pkg.module || `${output}/index.es.js`)

  return {
    pkg,
    dirname: path.dirname(mainDest),
    mainDest,
    moduleDest,
  }
}

function writeCSS(bundle, sourcemap) {
  const { code, codeFilePath, map, mapFilePath } = bundle
  return fs
    .ensureDir(path.dirname(codeFilePath))
    .then(() =>
      Promise.all([
        fs.writeFile(codeFilePath, code, 'utf8'),
        sourcemap && mapFilePath && fs.writeFile(mapFilePath, map, 'utf8'),
      ])
    )
}

function getRollupOptions({ onBuild, entry, nosourcemap, output, cwd } = {}) {
  const { dirname, mainDest, moduleDest } = getMeta({ output, cwd })

  let extractCSS = null
  const sourcemap = !nosourcemap
  const newOnBuild = async () => {
    if (extractCSS) {
      const bundle = extractCSS()
      extractCSS = null
      await writeCSS(bundle, sourcemap)
      console.log(bundle.codeFilePath)
    }
    return onBuild()
  }

  const outputOptions = [
    mainDest && {
      file: mainDest,
      format: 'cjs',
      strict: true,
      sourcemap,
    },
    moduleDest && {
      file: moduleDest,
      format: 'es',
      strict: true,
      sourcemap,
    },
  ].filter(Boolean)

  const inputOptions = {
    input: entry,
    plugins: [
      postcss({
        sourceMap: sourcemap,
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
    external: id => id[0] !== '.' && id[0] !== '/' && id[1] !== ':',
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

module.exports = getRollupOptions
