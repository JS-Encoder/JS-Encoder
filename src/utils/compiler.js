/**
 * 将预处理语言编译成html，css和javascript
 */

import Loader from './loader'
import { externalLinks } from './cdn'

const publicPath = process.env.BASE_URL
const loader = new Loader()

async function compileMarkdown (code) {
  let highlightJS, marked
  if (!loader.get('highlight')) {
    highlightJS = await import('highlight.js')
    loader.set('highlight', highlightJS)
  } else {
    highlightJS = loader.get('highlight')
  }
  if (!loader.get('markdown')) {
    marked = require('marked')
    loader.set('markdown', marked)
  } else {
    marked = loader.get('markdown')
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
function compilePug (code) {
  let pug
  if (!loader.get('pug')) {
    pug = require('pug')
    loader.set('pug', pug)
  } else {
    pug = loader.get('pug')
  }
  return pug.compile(code)({})
}
async function compileSass (code) {
  // scss&sass
  let sass
  if (!loader.get('sass')) {
    sass = require('../../public/js/compiler/sass')
    sass.setWorkerUrl(`${publicPath}js/compiler/sass.worker.js`)
    loader.set('sass', sass)
  } else {
    sass = loader.get('sass')
  }
  return new Promise((resolve, reject) => {
    new sass().compile(code, result => {
      if (result.status === 0) resolve(result.text)
      else resolve(code)
    })
  })
}
async function compileLess (code) {
  let less
  if (!loader.get('less')) {
    less = await import('less')
    loader.set('less', less)
  } else {
    less = loader.get('less')
  }
  return less.render(code)
}
async function compileStylus (code) {
  if (!loader.get('stylus')) {
    // 将stylus.js添加到head中
    await loader.loadScript(externalLinks.stylus).then(() => {
      loader.set('stylus', true)
    })
  }
  return new Promise((resolve, reject) => {
    stylus.render(code, { filename: 'foo.styl' }, (err, css) => {
      if (err) return reject(err)
      resolve(css)
    })
  })
}
async function compileTypeScript (code) {
  if (!loader.get('typeScript')) {
    await loader.loadScript(externalLinks.typeScript).then(() => {
      loader.set('typeScript', true)
    })
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
  if (!loader.get('coffeeScript')) {
    await loader.loadScript(externalLinks.coffeeScript).then(() => {
      loader.set('coffeeScript', true)
    })
  }
  return window.CoffeeScript.compile(code)
}
async function compileJSX (code) {
  if (!loader.get('JSX')) {
    await loader.loadScript(externalLinks.babel).then(() => {
      loader.set('JSX', true)
    })
  }
  return window.Babel.transform(code, { presets: ['react'] }).code
}

async function compileHTML (code, prep) {
  switch (prep) {
    case 'Markdown':
      await compileMarkdown(code).then(res => {
        code = res
      }).catch(err => {
        console.log(err)
      })
      break
    case 'Pug':
      code = compilePug(code)
      break
  }
  return code
}
async function compileCSS (code, prep) {
  switch (prep) {
    case 'Less':
      await compileLess(code).then(res => {
        code = res.css
      }).catch(err => {
        console.log(err)
      })
      break
    case 'Sass':
    case 'Scss':
      await compileSass(code).then(res => {
        code = res
      }).catch(err => {
        console.log(err)
      })
      break
    case 'Stylus':
      await compileStylus(code).then(res => {
        code = res
      }).catch(err => {
        console.log(err)
      })
      break
  }
  return code
}
async function compileJS (code, prep) {
  switch (prep) {
    case 'TypeScript':
      await compileTypeScript(code).then(res => {
        code = res
      }).catch(err => {
        console.log(err)
      })
      break
    case 'CoffeeScript':
      await compileCoffeeScript(code).then(res => {
        code = res
      }).catch(err => {
        console.log(err)
      })
      break
    case 'JSX':
      await compileJSX(code).then(res => {
        code = res
      }).catch(err => {
        console.log(err)
      })
      break
  }
  return code
}
export {
  compileHTML,
  compileCSS,
  compileJS
}