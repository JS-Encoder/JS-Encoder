<div align=center>
  <img width="150" src="./src/assets/images/logo.svg"/>
</div>

<h1 align="center">JS-Encoder</h1>

<p align="center">👉 一个由 Vue.js 和 Codemirror 构建的在线编译器 👈</p>

<div align=center>
  <a href="https://travis-ci.org/Longgererer/JS-Encoder">
    <img src="https://img.shields.io/travis/Longgererer/JS-Encoder.svg?style=flat-square"/>
  </a>
  <a href="https://github.styleci.io/repos/190842308">
    <img src="https://img.shields.io/badge/StyleCI-passed-green.svg?style=flat-square"/>
  </a>
  <a href="https://github.com/prettier/prettier">
    <img src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square"/>
  </a>
  <a href="https://github.com/Longgererer/JS-Encoder/blob/master/LICENSE">
    <img src="https://img.shields.io/badge/LICENSE-MIT-blue.svg?style=flat-square"/>
  </a>
</div>

<p align="center">简体中文 | <a href="https://github.com/Longgererer/JS-Encoder/blob/master/READMECN.md">English</a></p>

![1614658567_1_.png](http://picstore.lliiooiill.cn/1628329983.jpg)

## 使用

[进入 JS-Encoder](http://jsencoder.lliiooiill.cn/)

## 描述

**JS-Encoder** 在 [JS Bin](https://jsbin.com/)，[CODEPEN](https://codepen.io/) 和 [JSFiddle](https://jsfiddle.net/) 这三个优秀的在线编译器上获得了启发，由 Vue.js 和 Codemirror 构建而成。

## 特性 🌟

- [x] 实时显示效果。
- [x] 支持多种前端语言及预处理语言。
- [x] 支持外部脚本和样式。
- [x] 本地存储, 你可以在本地保存编译器上的代码, 目前支持三种形式：
  - 单文件: 将 HTML, CSS, 和 JS 整合到一个名为 index.html 的文件中。
  - 压缩包: 将 HTML, CSS, 和 JS 分别创建一个文件并放在一个文件夹中压缩为 zip 文件。
  - 预处理文件: 如果你使用了预处理语言，那么可以下载未编译的预处理语言文件。
- [x] 文件导入, 你可以从本地导入文件到编译器中, 成功后编译器将自动读取文件内容并显示在编辑窗口中。
- [x] 多快捷键支持, 包括 emmet 扩展。
- [x] 加入 markdown 模式, 支持编辑窗口和预览窗口的实时预览和同步滚动，并加入快捷菜单栏
- [x] 代码搜索功能。
- [x] CDN 搜索功能，更快捷的添加所需的 CSS 和 JS 外部链接。
- [x] 控制台，显示日志并可进行调试。
- [x] 代码智能提示。
- [x] 个性化设置。
- [x] 为部分语言提供语法检查(linter)

## 未来 ❓

- **重构**，由于 Vue3 的新特性和对 TypeScript 的支持，JS-Encoder 将会在所有依赖的 Vue 插件兼容 Vue3 之后进行重构。
- **语言支持**，JS-Encoder 也许会支持更多的前端语言，如支持 Vue 和 React 的组件编写。
- **更多的个性化设置**。

## Support

如果你喜欢 **JS-Encoder**，点个 star 💗 支持一下吧！

## LICENSE

[The MIT LICENSE](https://github.com/Longgererer/JS-Encoder/blob/master/LICENSE)
