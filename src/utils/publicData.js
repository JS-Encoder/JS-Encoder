/**
 * 存储一些多个组件共用的公共数据
 */

module.exports = {
  defPrepOpts: {
    HTML: ['HTML', 'Markdown', 'Pug'],
    CSS: ['CSS', 'Sass', 'Scss', 'Less', 'Stylus'],
    JavaScript: ['JavaScript', 'TypeScript', 'CoffeeScript'],
  },
  // 上传文件等后缀名列表
  limitMimeType: ['html', 'css', 'js', 'md', 'pug', 'sass', 'scss', 'less', 'styl', 'ts', 'coffee'],
  // 代码字体
  fontList: [
    {
      name: 'Consolas',
    },
    {
      name: 'Monaco',
    },
    {
      name: 'Courier New',
    },
    {
      name: 'Fira Code',
    },
    {
      name: 'Hack',
    },
  ],
  // 不同语言对应的icon
  iconMap: {
    HTML: 'icon-html',
    Markdown: 'icon-markdown',
    Pug: 'icon-pug',
    CSS: 'icon-style',
    Less: 'icon-less',
    Sass: 'icon-Sass',
    Scss: 'icon-Sass',
    Stylus: 'icon-stylus',
    JavaScript: 'icon-javascript',
    TypeScript: 'icon-typescript',
    CoffeeScript: 'icon-coffeescript',
  },
  // 不同文件后缀名或类型对应的icon
  suffixIconMap: {
    html: 'icon-html',
    md: 'icon-markdown',
    pug: 'icon-pug',
    css: 'icon-style',
    less: 'icon-less',
    sass: 'icon-Sass',
    scss: 'icon-Sass',
    styl: 'icon-stylus',
    js: 'icon-javascript',
    ts: 'icon-typescript',
    coffee: 'icon-coffeescript',
    vue: 'icon-vue',
    jsx: 'icon-react',
    image: 'icon-pic',
    json: 'icon-json',
    file: 'icon-wenjian',
    folderOpen: 'icon-folder-open',
    folderClose: 'icon-folder-close',
  },
}
