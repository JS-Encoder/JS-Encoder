module.exports = {
  defPrepOpts: {
    HTML: ['HTML', 'Markdown', 'Pug'],
    CSS: ['CSS', 'Sass', 'Scss', 'Less', 'Stylus'],
    JavaScript: ['JavaScript', 'TypeScript', 'CoffeeScript', 'JSX'],
  },
  // 上传文件等后缀名列表
  limitMimeType: ['html', 'css', 'js', 'jsx', 'md', 'pug', 'sass', 'scss', 'less', 'styl', 'ts', 'coffee'],
  // 代码字体
  fontList: [
    'Consolas',
    'Monaco',
    'Courier Prime',
    'JetBrains Mono',
    'Fira Code',
    'Hack',
    'Source Code Pro',
    'Space Mono',
    'IBM Plex Mono',
    'Inconsolata'
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
    JSX: 'icon-jsx'
  },
  templatesInfo: {
    Vanilla: {
      preprocessor: ['HTML', 'CSS', 'JavaScript'],
      links: {
        cssLinks: [],
        JSLinks: []
      },
      code: {
        HTML: '<h1>This is a template of Vanilla!</h1>',
        CSS: '',
        JavaScript: ''
      }
    },
    Vue2: {
      preprocessor: ['HTML', 'CSS', 'JavaScript'],
      links: {
        cssLinks: [],
        JSLinks: ['https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js']
      },
      code: {
        HTML: '<div id=\"app\">\n\t{{ message }}\n</div>',
        CSS: '',
        JavaScript: `var app = new Vue({\n\tel: '#app',\n\tdata: {\n\t\tmessage: 'This is a template of Vue2!'\n\t}\n})`
      }
    },
    Vue3: {
      preprocessor: ['HTML', 'CSS', 'JavaScript'],
      links: {
        cssLinks: [],
        JSLinks: ['https://unpkg.com/vue@next']
      },
      code: {
        HTML: '<div id=\"app\">\n\t{{message}}\n</div>',
        CSS: '',
        JavaScript: `const app = {\n\tdata() {\n\t\treturn {\n\t\t\tmessage: 'This is a template of Vue3!'\n\t\t}\n\t}\n}\n\nVue.createApp(app).mount('#app')`
      }
    },
    React: {
      preprocessor: ['HTML', 'CSS', 'JSX'],
      links: {
        cssLinks: [],
        JSLinks: [
          'https://unpkg.com/react@17/umd/react.development.js',
          'https://unpkg.com/react-dom@17/umd/react-dom.development.js'
        ]
      },
      code: {
        HTML: '<div id=\"root\">\n\t{{message}}\n</div>',
        CSS: '',
        JavaScript: `ReactDOM.render(\n\t<h1>This is a template of React!</h1>,\n\tdocument.getElementById('root')\n);`
      }
    },
    Angular: {
      preprocessor: ['HTML', 'CSS', 'JavaScript'],
      links: {
        cssLinks: [],
        JSLinks: ['https://unpkg.com/angular@1.8.2/angular.js']
      },
      code: {
        HTML: `<div ng-app="myApp" ng-controller="myCtrl">\n\t{{message}}\n</div>`,
        CSS: '',
        JavaScript: `var app = angular.module('myApp', [])\napp.controller('myCtrl', function ($scope) {\n\t$scope.message = 'This is a template of Angular'\n})`
      }
    },
  }
}
