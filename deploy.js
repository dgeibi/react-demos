const { copySync, writeFileSync, removeSync } = require('fs-extra')
const glob = require('glob')
const ghPages = require('gh-pages')
const html = require('html-template-tag')

const SITE = './site'

glob('./packages/*-demo/dist', (err, matches) => {
  if (err) throw err
  if (matches.length < 1) {
    throw Error('nothing to do')
  }
  const names = []
  matches.forEach(x => {
    const name = x.match(/([^/]+)-demo/)[1]
    const dist = `${SITE}/${name}`
    removeSync(dist)
    copySync(x, dist)
    console.log(dist)
    names.push(name)
  })
  writeFileSync(`${SITE}/index.html`, indexTemplate({ names }))
  ghPages.publish(SITE, error => {
    if (error) throw error
  })
})

const urls = [
  'https://cdn.polyfill.io/v2/polyfill.min.js',
  'https://cdn.jsdelivr.net/npm/react@16.2.0/umd/react.production.min.js',
  'https://cdn.jsdelivr.net/npm/react-dom@16.2.0/umd/react-dom.production.min.js',
]

function indexTemplate({ names }) {
  return html`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>React Demos</title>
  ${urls.map(
    url => html`<link rel="prefetch" href="${url}"><link rel="preload" href="${url}">`
  )}
</head>
<body>
  <ul>${names.map(x => html`<li><a href="${x}/">${x}</a></li>`)}</ul>
</body>
</html>`
}
