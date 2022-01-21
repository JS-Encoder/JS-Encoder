<div align=center>
  <img width="150" src="./src/assets/images/logo.svg"/>
</div>

<h1 align="center">JS-Encoder</h1>

<p align="center">👉 A front-end code editor based on Vue.js and Codemirror 👈</p>

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

<p align="center">English | <a href="https://github.com/Longgererer/JS-Encoder/blob/master/READMECN.md">简体中文</a></p>

![1614658567_1_.png](http://picstore.lliiooiill.cn/1642123287%281%29.jpg)

> The code in this figure comes from [CodePen](https://codepen.io/andymerskin/pen/XNMWvQ)

## Preview

[open JS-Encoder](http://jsencoder.lliiooiill.cn/)

If you can't visit this site:

[open by github page](https://js-encoder.github.io/JS-Encoder-preview/)

## Describe

**JS-Encoder** gets some inspiration from [JSBin](https://jsbin.com), [CodePen](https://codepen.io/pen/) and [JSFiddle](https://jsfiddle.net/), JS-Encoder inspired by these three excellent online compilers, built with Vue.js and Codemirror.

## Feature 🌟

- [x] Live preview.
- [x] Support for a variety of front-end languages and pre-processing languages. Currently supported preprocessing languages are:
  - Markdown
  - Pug
  - Sass/Scss
  - Less
  - Stylus
  - TypeScript
  - CoffeeScript
  - JSX(Babel)
- [x] Support for external scripts and styles.
- [x] Local storage, where you can save code on the compiler locally, currently supports three forms:
  - Single file: A file include HTML, CSS and JS named index.html.
  - Zip: A zip file include HTML file, CSS file and JS file.
  - Preprocessing files: if you are using a preprocessing language, you can download a preprocessing language file that is not compiled.
- [x] File import, you can import the file from the local to the compiler, the compiler will automatically read the contents of the file and display in the edit window.
- [x] Support for multiple keyboard shortcuts, includes formatting, HTML Emmet extensions, and Markdown related shortcuts.
- [x] Add Markdown mode, support edit window and preview window real-time preview and synchronization scrolling, and join the shortcut menu bar.
- [x] Code Search.
- [x] CDN search, faster to add required CSS and JS external links(Powered by cdnjs).
- [x] Powerful console for displaying many common types of logs and debugging.
- [x] Code hinter.
- [x] Personalized settings.
- [x] linter for some languages.
- [x] Support for initializing templates, currently supported (vue2/3, React, Angular).

## DOC(Chinese)

[JS-Encoder 中文使用文档](http://doc.lliiooiill.cn/)

## Future ❓

- **rebuild**, due to the new features of Vue3 and the support for TypeScript, JS-Encoder will be refactored after all dependent Vue plugins are compatible with Vue3.
- **Preprocessor support**, JS-Encoder may support more front-end languages, such as component writing that supports Vue and React.
- **More personalized settings**.

## Support

If you want to support **JS-Encoder**, click star 💗 to support it!

## LICENSE

[The MIT LICENSE](https://github.com/Longgererer/JS-Encoder/blob/master/LICENSE)
