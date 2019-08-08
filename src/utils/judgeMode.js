/* eslint-disable */
const modeList = {
  HTML: 'text/html',
  MarkDown: 'text/x-markdown',
  CSS: 'css',
  Sass: 'text/x-sass',
  Scss: 'text/x-scss',
  Less: 'text/x-less',
  Stylus: 'text/x-styl',
  JavaScript: 'text/javascript',
  TypeScript: 'text/typescript',
  CoffeeScript: 'text/coffeescript'
}

function judgeMode(edit) {
  switch (edit) {
    case 'HTML':
    case 'MarkDown':
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

function judgeExtension(edit) {
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

function getStyleMode(edit) {
  return modeList[edit]
}

export {
  judgeMode,
  judgeExtension,
  getStyleMode
}