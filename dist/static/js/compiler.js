/* eslint-disable */
import loadjs from 'loadjs'

const defaultPresets = [
  [
    'es2015',
    {
      modules: false
    }
  ],
  'es2016',
  'es2017',
  'stage-0'
]

class LoadFiles {
  constructor() {
    this.map = {}
  }

  set(k, v) {
    this.map[k] = v
  }

  get(k) {
    return this.map[k]
  }
}

const loadFiles = new LoadFiles()

function asyncLoad(resources, name) {
  return new Promise((resolve, reject) => {
    if (loadjs.isDefined(name)) {
      resolve()
    } else {
      loadjs(resources, name, {
        success() {
          resolve()
        },
        error() {
          reject(new Error('network error'))
        }
      })
    }
  })
}

async function compileMarkDown(code) {
  if (!loadFiles.get('markdown')) {
    const marked = await import('marked')
    loadFiles.set('markdown', marked)
  }
  return loadFiles.get('markdown')(code)
}

async function compileSass(code) {
  // scss&sass
  if (!loadFiles.get('sass')) {
    const Sass = await require('./sass')
    Sass.setWorkerUrl('static/js/sass.worker.js')
    loadFiles.set('sass', Sass)
  }

  const defSass = loadFiles.get('sass')
  const sass = new defSass()
  return new Promise((resolve, reject) => {
    sass.compile(code, result => {
      if (result.status === 0) resolve(result.text)
      else reject(new Error('fail to get result'))
    })
  })
}

async function compileLess(code) {
  if (!loadFiles.get('less')) {
    const less = await import('less')
    loadFiles.set('less', less)
  }
  const defLess = loadFiles.get('less')
  return defLess.render(code)
}

async function compileStylus(code) {
  if (!loadjs.isDefined('stylus')) {
    await asyncLoad('/static/js/stylus.js', 'stylus')
  }
  return new Promise((resolve, reject) => {
    window.stylus.render(code, { filename: 'foo.styl' }, (err, css) => {
      if (err) return reject(err)
      resolve(css)
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
  return res.outputText
}

async function compileCoffeeScript(code) {
  if (!loadjs.isDefined('coffeeScript')) {
    await asyncLoad('/static/js/coffeescript.js', 'coffeeScript')
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
