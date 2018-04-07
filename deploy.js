const { copySync, writeFileSync, emptyDirSync } = require('fs-extra')
const { spawn } = require('child_process')
const glob = require('glob')
const ghPages = require('gh-pages')
const html = require('html-template-tag')

const SITE = './site'

glob('./packages/*-demo/dist', (err, matches) => {
  if (err) throw err
  if (matches.length < 1) {
    console.log('nothing to do')
    process.exit(1)
  }

  /* clean up */
  emptyDirSync(SITE)
  matches.forEach(dir => {
    emptyDirSync(dir)
  })

  const deploy = () => {
    const names = []
    matches.forEach(dir => {
      const name = dir.match(/([^/]+)-demo/)[1]
      const dist = `${SITE}/${name}`
      copySync(dir, dist)
      console.log(dist)
      names.push(name)
    })
    writeFileSync(`${SITE}/index.html`, indexTemplate({ names }))
    ghPages.publish(SITE, error => {
      if (error) throw error
    })
  }

  spawn('npm run -s build', {
    stdio: 'inherit',
    shell: true,
  })
    .on('close', deploy)
    .on('error', error => {
      throw error
    })
})

const urls = require('./scripts.json')

function indexTemplate({ names }) {
  return html`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>React Demos</title>
  ${urls.map(url => html`<link rel="prefetch" href="${url}">`)}
</head>
<body>
  <ul>${names.map(x => html`<li><a href="${x}/">${x}</a></li>`)}</ul>
</body>
</html>`
}
