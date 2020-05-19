/* eslint-disable */
const modeList = {
  HTML: 'text/html',
  Markdown: 'text/x-markdown',
  CSS: 'css',
  Sass: 'text/x-sass',
  Scss: 'text/x-scss',
  Less: 'text/x-less',
  Stylus: 'text/x-styl',
  JavaScript: 'text/javascript',
  TypeScript: 'text/typescript',
  CoffeeScript: 'text/coffeescript'
}

function judgeMode (edit) {
  switch (edit) {
    case 'HTML':
    case 'Markdown':
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
      return 'JavaScript'
  }
}

function judgeMimeType (edit) {
  switch (edit) {
    case 'Markdown':
      return 'md'
    case 'Sass':
      return 'sass'
    case 'Scss':
      return 'scss'
    case 'Less':
      return 'less'
    case 'Stylus':
      return 'styl'
    case 'TypeScript':
      return 'ts'
    case 'CoffeeScript':
      return 'coffee'
  }
}

function judgeModeByMimeType (type) {
  switch (type) {
    case 'md':
      return 'Markdown'
    case 'sass':
      return 'Sass'
    case 'scss':
      return 'Scss'
    case 'less':
      return 'Less'
    case 'styl':
      return 'Stylus'
    case 'ts':
      return 'TypeScript'
    case 'coffee':
      return 'CoffeeScript'
    case 'html':
      return 'HTML'
    case 'css':
      return 'CSS'
    case 'js':
      return 'JavaScript'
  }
}

function getStyleMode (edit) {
  return modeList[edit]
}

export {
  judgeMode,
  judgeExtension,
  judgeMimeType,
  getStyleMode,
  judgeModeByMimeType
}