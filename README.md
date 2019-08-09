# JS-Encoder

[![Travis (.org)](https://img.shields.io/travis/Longgererer/JS-Encoder.svg?style=flat-square)](https://travis-ci.org/Longgererer/JS-Encoder) [![](https://img.shields.io/badge/StyleCI-passed-green.svg?style=flat-square)](https://github.styleci.io/repos/190842308) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier) [![](https://img.shields.io/badge/LICENSE-MIT-blue.svg?style=flat-square)](https://github.com/Longgererer/JS-Encoder/blob/master/LICENSE)

[English version]('https://github.com/Longgererer/JS-Encoder/blob/master/README_EN.md')

👉 **JS-Encoder**是一个完全开源的 WEB 在线编译器 👈

[点击链接体验编译器](https://longgererer.github.io/JS-Encoder/dist)

![未标题-1.png](https://i.loli.net/2019/06/26/5d1305085801b58179.png)

本编译器从 [JS Bin](https://jsbin.com) 和 [CODEPEN](https://codepen.io/pen/) 这两个优秀的在线编译器中获得灵感, 采用 Vue.js 和 Webpack 构建

JS-Encoder 目前处于完善阶段！

## 界面展示

[![截图未命名.jpg](https://i.loli.net/2019/07/27/5d3c2b2e3d90685570.jpg)](https://i.loli.net/2019/07/27/5d3c2b2e3d90685570.jpg)

## JS-Encoder 的特性 ❓

- [x] 支持离线使用, 你可以直接将仓库克隆到本地进行离线使用
- [x] 实时显示效果
- [x] 支持其他预处理语言, 现支持 MarkDown, Sass, Scss, Less, Stylus, TypeScript 和 CoffeeScript 之后会考虑支持 LiveScript 和 JSX(React)
- [x] 通过 CDN 或其他路径, 你可以使用别人的 HTML, CSS, 和 JS 来编写你的代码
- [x] 本地存储, 你可以在本地保存编译器上的代码, 目前支持两种
  - 单文件: 将 HTML, CSS, 和 JS 整合到一个名为 index.html 的文件中
  - 压缩包: 将 HTML, CSS, 和 JS 分别创建一个文件并放在一个文件夹中压缩为 zip 文件
- [x] 文件导入, 你可以从本地导入文件到编译器中, 成功后编译器将自动读取文件内容并显示在编辑窗口中
- [x] 颜色板
  - 颜色选择: 在颜色版中选择你想要的颜色, 点击之后会自动将 HEX 格式的颜色添加到剪切板
  - 颜色转换: 你可以在 HEX 格式和 RGB 格式之间相互转换 🔄
- [x] 个性化设置
- [x] 多快捷键支持，比如:

  - <kbd>Tab</kbd>:

  [![GIF.gif](https://i.loli.net/2019/07/27/5d3c17c61b95532245.gif)](https://i.loli.net/2019/07/27/5d3c17c61b95532245.gif)

  - <kbd>Ctrl</kbd> + <kbd>Space</kbd>:

  [![GIF.gif](https://i.loli.net/2019/08/02/5d440f953cdbb32371.gif)](https://i.loli.net/2019/08/02/5d440f953cdbb32371.gif)

## 离线使用

```dash
git clone https://github.com/Longgererer/JS-Encoder.git
```

或者使用 [Github Desktop](https://desktop.github.com/) 工具

使用 yarn 来初始化并运行这个项目

初始化

```dash
yarn
```

运行项目

```dash
yarn dev
```

## 未来的行动 ❓

- 预处理语言支持, JS-Encoder 在不久的将来会支持更多的预处理语言
- 加入后台, JS-Encoder 现在完全是一个没有后台的代码编辑器, 之后将会使用 Node 编写后台
- 代码分享, 可以通过链接 🔗 的方式向别人展示你的代码
- 添加更多个性化功能
- 优化用户体验, JS-Encoder 在几个月前才正式开发, 现在有很多需要优化的地方, 这也是 JS-Encoder 需要解决的最重要的问题 🧐

## 支持

如果你想支持 JS-Encoder，点个 star 💗 支持我吧！

## LICENSE

[The MIT LICENSE](https://github.com/Longgererer/JS-Encoder/blob/master/LICENSE)
