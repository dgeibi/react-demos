const { copySync, writeFileSync, removeSync } = require('fs-extra')
const glob = require('glob')
const ghPages = require('gh-pages')

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

function indexTemplate({ names }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>React Demo</title>
</head>
<body>
  <ul>${names.map(x => `<li><a href="${x}/index.html">${x}</a></li>`).join('')}</ul>
</body>
</html>`
}
