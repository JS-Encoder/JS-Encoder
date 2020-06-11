/**
 * 将预处理语言编译成html，css和javascript
 */
import loadjs from 'loadjs'

const cdn = {
  typeScript: 'https://cdn.jsdelivr.net/npm/browserified-typescript@0.3.0/index.js'
}

class LoadFiles {
  constructor() {
    this.map = {}
  }
  set (k, v) {
    this.map[k] = v
  }
  get (k) {
    return this.map[k]
  }
}

const loadFiles = new LoadFiles()

function asyncLoad (resources, name) {
  return new Promise((resolve, reject) => {
    if (loadjs.isDefined(name)) {
      resolve()
    } else {
      loadjs(resources, name, {
        success () {
          resolve()
        },
        error () {
          reject(new Error('network error'))
        }
      })
    }
  })
}

async function compileMarkDown (code) {
  let highlightJS, marked
  if (!loadFiles.get('highlight')) {
    highlightJS = await import('highlight.js')
    loadFiles.set('highlight', highlightJS)
  } else {
    highlightJS = loadFiles.get('highlight')
  }
  if (!loadFiles.get('markdown')) {
    marked = await import('marked')
    loadFiles.set('markdown', marked)
  } else {
    marked = loadFiles.get('markdown')
  }
  marked.setOptions({
    renderer: new marked.Renderer(),
    highlight (code, language) {
      return highlightJS.highlightAuto(code).value
    },
    pedantic: false,
    gfm: true,
    tables: true,
    breaks: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    xhtml: false
  })
  return marked(code)
}

async function compileSass (code) {
  // scss&sass
  if (!loadFiles.get('sass')) {
    const Sass = await require('../../static/js/sass')
    Sass.setWorkerUrl('static/js/sass.worker.js')
    loadFiles.set('sass', Sass)
  }

  const defSass = loadFiles.get('sass')
  const sass = new defSass()
  return new Promise((resolve, reject) => {

    sass.compile(code, result => {
      if (result.status === 0) resolve(result.text)
      else {
        resolve(code)
      }
    })
  })
}

async function compileLess (code) {
  if (!loadFiles.get('less')) {
    const less = await import('less')
    loadFiles.set('less', less)
  }
  const defLess = loadFiles.get('less')
  return defLess.render(code)
}

async function compileStylus (code) {
  if (!loadjs.isDefined('stylus')) {
    await asyncLoad('../../static/js/stylus.js', 'stylus')
  }
  return new Promise((resolve, reject) => {
    window.stylus.render(code, { filename: 'foo.styl' }, (err, css) => {
      if (err) return reject(err)
      resolve(css)
    })
  })
}

async function compileTypeScript (code) {
  if (!loadjs.isDefined('typeScript')) {
    await asyncLoad(cdn.typeScript, 'typeScript')
  }
  const res = window.typescript.transpileModule(code, {
    fileName: '/foo.ts',
    reportDiagnostics: true,
    compilerOptions: {
      module: 'es2015'
    }
  })
  return res.outputText
}

async function compileCoffeeScript (code) {
  if (!loadjs.isDefined('coffeeScript')) {
    await asyncLoad('../../static/js/coffeescript.js', 'coffeeScript')
  }
  return window.CoffeeScript.compile(code)
}

export {
  compileMarkDown,
  compileSass,
  compileLess,
  compileStylus,
  compileTypeScript,
  compileCoffeeScript
}
