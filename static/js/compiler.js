// eslint-disable import/no-mutable-exports
import marked from 'marked'

function compileMarkDown(code) {
  return marked(code, { sanitize: true })
}

function compileSass(code = '') {
  const Sass = require('../../static/js/sass.js')
  Sass.setWorkerUrl('../../static/js/sass.worker.js')
  const sass = new Sass()
  return new Promise((resolve, reject) => {
    sass.compile(code, result => {
      if (result.status === 0) resolve(result.text)
      else reject(new Error('fail to get result'))
    })
  })
}

function compileTypeScript(code) {
  let tyScript = process.env.TYPESCRIPT_CDN
  console.log(tyScript)
  let JSFile = new FileReader()
}

export {
  compileMarkDown,
  compileSass,
  compileTypeScript
}
