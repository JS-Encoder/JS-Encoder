const externalLinks = {
  stylus: 'https://cdn.bootcdn.net/ajax/libs/stylus/0.32.1/stylus.js',
  typeScript: 'https://cdn.jsdelivr.net/npm/browserified-typescript@0.3.0/index.js',
  coffeeScript: 'https://cdn.jsdelivr.net/npm/coffeescript@2.5.1/lib/coffeescript-browser-compiler-legacy/coffeescript.js',
  babel: 'https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.26.0/babel.min.js'
}

const iframeLinks = {
  mdCSS: [
    '/css/markdown-style.css',
    'https://cdn.bootcdn.net/ajax/libs/KaTeX/0.13.13/katex.css'
  ],
  mdJS: [
    'https://cdn.bootcdn.net/ajax/libs/raphael/2.3.0/raphael.min.js',
    'https://cdn.bootcdn.net/ajax/libs/flowchart/1.15.0/flowchart.min.js',
    'https://cdn.bootcdn.net/ajax/libs/KaTeX/0.13.13/katex.min.js',
    'https://cdn.bootcdn.net/ajax/libs/KaTeX/0.13.13/contrib/auto-render.min.js'
  ],
  commonJS: [
    '/js/common/JSEController.js'
  ]
}

const formatLinks = {
  typeScript: 'https://unpkg.com/prettier@2.5.1/parser-typescript.js'
}

const images = 'http://picstore.lliiooiill.cn'

export {
  externalLinks,
  iframeLinks,
  images,
  formatLinks
}