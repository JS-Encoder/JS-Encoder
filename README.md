<div align=center>
  <img width="150" src="./src/assets/images/logo.svg"/>
</div>

<h1 align="center">JS-Encoder</h1>

<p align="center">👉 An online WEB compiler based on Vue.js and Codemirror👈</p>

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

![1614658567_1_.png](https://i.loli.net/2021/03/02/7U91gDpSOnqkTW3.png)

## Preview

[open JS-Encoder](http://jsencoder.lliiooiill.cn/)

## Describe

**JS-Encoder** gets some inspiration from [JS Bin](https://jsbin.com) and [CODEPEN](https://codepen.io/pen/), both of then are excellent online compiler. Built with Vue.js and Codemirror.

In fact, JS-Encoder was released in its original version last year, but there were many shortcomings, so this year I rebuilt the JS-Encoder. If you want to see the old version, please go to: [The old version](https://www.lliiooiill.cn/jsencoder).

## Feature 🌟

- [x] Live preview.
- [x] Support for a variety of front-end languages and pre-processing languages.
- [x] Support for external scripts and styles.
- [x] Local storage, where you can save code on the compiler locally, currently supports three forms:
  - Single file: A file include HTML, CSS and JS named index.html.
  - Zip: A zip file include HTML file, CSS file and JS file.
  - Preprocessing files: if you are using a preprocessing language, you can download a preprocessing language file that is not compiled.
- [x] File import, you can import the file from the local to the compiler, the compiler will automatically read the contents of the file and display in the edit window.
- [x] Support for multiple keyboard shortcuts, including the emmet extension.
- [x] Add markdown mode, support edit window and preview window real-time preview and synchronous scrolling, and add shortcut menu bar.
- [x] Search code function.
- [x] CDN search function, faster to add required CSS and JS external links.
- [x] Console, display log and debug.
- [x] Code hinter.
- [x] Personalized settings.
- [x] linter for some languages.

## Future ❓

- **rebuild**, due to the new features of Vue3 and the support for TypeScript, JS-Encoder will be refactored after all dependent Vue plugins are compatible with Vue3.
- **Preprocessor support**, JS-Encoder may support more front-end languages, such as component writing that supports Vue and React.
- **More personalized settings**.

## Support

If you want to support **JS-Encoder**, click star 💗 to support it!

## LICENSE

[The MIT LICENSE](https://github.com/Longgererer/JS-Encoder/blob/master/LICENSE)
