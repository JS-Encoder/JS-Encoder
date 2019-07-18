/* eslint-disable */
import marked from 'marked'

function compileMarkDown(code) {
  return marked(code, { sanitize: true })
}

async function compileSass(code) {
  const Sass = require('./sass')
  Sass.setWorkerUrl('static/js/sass.worker.js')
  const sass = new Sass()
  return new Promise((resolve, reject) => {
    sass.compile(code, result => {
      if (result.status === 0) resolve(result.text)
      else reject(new Error('fail to get result'))
    })
  })
}

function compileTypeScript(code) {
  const res = window.typescript.transpileModule(code, {
    fileName: '/foo.ts',
    reportDiagnostics: true,
    compilerOptions: {
      module: 'es2015'
    }
  })
  console.log(res)
}

export {
  compileMarkDown,
  compileSass,
  compileTypeScript
}
