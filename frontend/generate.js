const openapi = require('openapi-client')
const pkg = require('./package.json')

openapi.genCode({
  src: pkg.openapiUrl,
  outDir: './src/gen',
  language: 'ts',
})
.then(complete, error)

function complete(spec) {
  console.info('Service generation complete')
}

function error(e) {
  console.error(e.toString())
}
