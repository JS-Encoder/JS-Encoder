const modeStyleList = {
  HTML: 'text/html',
  Markdown: 'text/md-mix',
  Pug: 'text/x-pug',
  CSS: 'css',
  Sass: 'text/x-sass',
  Scss: 'text/x-scss',
  Less: 'text/x-less',
  Stylus: 'text/x-styl',
  JavaScript: 'text/javascript',
  TypeScript: 'text/typescript',
  CoffeeScript: 'text/coffeescript',
  JSX: 'text/jsx',
  Vue2: 'text/x-vue',
  Vue3: 'text/x-vue',
}

function judgeMode (edit) {
  switch (edit) {
    case 'HTML':
    case 'Markdown':
    case 'Pug':
      return 'HTML'
    case 'CSS':
    case 'Sass':
    case 'Scss':
    case 'Less':
    case 'Stylus':
      return 'CSS'
    case 'JavaScript':
    case 'TypeScript':
    case 'CoffeeScript':
    case 'JSX':
      return 'JavaScript'
    case 'Console':
      return 'Console'
    case 'Output':
      return 'Output'
  }
}

function judgeExtension (edit) {
  switch (edit) {
    case 'html':
    case 'md':
    case 'pug':
      return 'HTML'
    case 'css':
    case 'sass':
    case 'scss':
    case 'less':
    case 'styl':
      return 'CSS'
    case 'js':
    case 'ts':
    case 'coffee':
    case 'jsx':
      return 'JavaScript'
  }
}

const mimeTypeMap = {
  Markdown: 'md',
  Pug: 'pug',
  Sass: 'sass',
  Scss: 'scss',
  Less: 'less',
  Stylus: 'styl',
  TypeScript: 'ts',
  CoffeeScript: 'coffee',
  JSX: 'jsx'
}

const ModeMimeTypeMap = {
  md: 'Markdown',
  pug: 'Pug',
  sass: 'Sass',
  scss: 'Scss',
  less: 'Less',
  styl: 'Stylus',
  ts: 'TypeScript',
  coffee: 'CoffeeScript',
  jsx: 'JSX',
  html: 'HTML',
  css: 'CSS',
  js: 'JavaScript',
}

export { judgeMode, judgeExtension, mimeTypeMap, modeStyleList, ModeMimeTypeMap }
