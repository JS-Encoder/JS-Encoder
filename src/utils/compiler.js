/**
 * 将预处理语言编译成html，css和javascript
 */

import Loader from './loader'
import { externalLinks } from './cdn'
import hash from 'hash-sum'
import { firstUpper } from './tools'

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

async function compileVue2 (code) {
  let vue
  if (!loader.get('vue')) {
    vue = require('@vue/compiler-sfc')
    loader.set('vue', vue)
  } else {
    vue = loader.get('vue')
  }
  const id = hash(code)
  const dataVId = 'data-v-' + id
  const parseResult = vue.parse(code, { sourceMap: false })
  const descriptor = parseResult.descriptor
  // script
  const script = vue.compileScript(descriptor, { id })
  // style
  const styles = descriptor.styles
  const styleCodes = []
  if (styles.length) {
    for (let i = 0;i < styles.length;i++) {
      const styleItem = styles[i]
      const lang = firstUpper(styleItem.lang)
      let cssCode = await compileCSS(styleItem.content, lang)
      styleCodes.push(vue.compileStyle({
        source: cssCode,
        id: dataVId,
        scoped: styleItem.scoped,
      }).code.trim())
    }
  }
  const styleCode = styleCodes.join('\n').replace(/url\(\s*(?:(["'])((?:\\.|[^\n\\"'])+)\1|((?:\\.|[^\s,"'()\\])+))\s*\)/g, (_, quotes, relUrl1, relUrl2) => {
    return 'url(' + quotes + resolveUrl(relUrl1 || relUrl2, styleUrl) + quotes + ')'
  })
  const mainName = '_sfc_main'
  const scriptCode = `
  ${vue.rewriteDefault(script.content, mainName)}
  const app = new Vue({
    el: '#app',
    template: \`${descriptor.template.content}\`,
    ...${mainName},
  })
  `.trim()
  return {
    HTMLCode: '<div id="app"></div>',
    CSSCode: styleCode,
    JSCode: scriptCode
  }
}

async function compileVue3 (code) {
  let vue
  if (!loader.get('vue')) {
    vue = require('@vue/compiler-sfc')
    loader.set('vue', vue)
  } else {
    vue = loader.get('vue')
  }
  const { parse, compileScript, rewriteDefault } = vue
  const descriptor = parse(code).descriptor
  const id = hash(code)
  const dataVId = 'data-v-' + id
  const compiledScript = compileScript(descriptor, { id })

  // style
  const styles = descriptor.styles
  const styleCodes = []
  if (styles.length) {
    for (let i = 0;i < styles.length;i++) {
      const styleItem = styles[i]
      const lang = firstUpper(styleItem.lang)
      let cssCode = await compileCSS(styleItem.content, lang)
      styleCodes.push(vue.compileStyle({
        source: cssCode,
        id: dataVId,
        scoped: styleItem.scoped,
      }).code.trim())
    }
  }
  const styleCode = styleCodes.join('\n').replace(/url\(\s*(?:(["'])((?:\\.|[^\n\\"'])+)\1|((?:\\.|[^\s,"'()\\])+))\s*\)/g, (_, quotes, relUrl1, relUrl2) => {
    return 'url(' + quotes + resolveUrl(relUrl1 || relUrl2, styleUrl) + quotes + ')'
  })
  const mainName = '_sfc_main'
  let scriptCode = rewriteDefault(compiledScript.content, mainName)
  const importReg = /import [^<]* from \'vue\'/
  const importList = scriptCode.match(importReg)
  const importStr = importList ? importList[0] : ''
  const importContent = importStr.match(/{.+}/)
  scriptCode = scriptCode.replace(importReg, `const ${importContent} = Vue`)
  const templateCode = descriptor.template.content.trim()
  const HTMLCode = `
  <div id="app"></div>
  <script type="module">
    ${scriptCode}
    const _sfc_app = Vue.createApp({
      template: \`${templateCode}\`,
      ...${mainName}
    }).mount('#app')
  </script>
  `.trim()
  return {
    HTMLCode,
    CSSCode: styleCode,
    JSCode: ''
  }
}

export {
  compileHTML,
  compileCSS,
  compileJS,
  compileVue2,
  compileVue3
}