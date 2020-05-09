const fetch = require('isomorphic-fetch')
const pkg = require('./package.json')
const fs = require('fs')
const path = require('path')

async function run() {
  const res = await fetch(pkg.openapiUrl, {
    headers: {
      'accept': 'application/yaml'
    }
  })
  if(!res.ok) {
    throw new Error(res.status)
  }
  const text = await res.text()
  console.log("content-length: ", text.length)
  fs.writeFileSync(path.join(__dirname, './pet-sitter.yaml'), text, 'utf8')
  console.log('Downloaded pet-sitter.yaml')
}

try {
  run()
} catch(err) {
  console.error(err)
}
