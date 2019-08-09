# JS-Encoder

[![Travis (.org)](https://img.shields.io/travis/Longgererer/JS-Encoder.svg?style=flat-square)](https://travis-ci.org/Longgererer/JS-Encoder) [![](https://img.shields.io/badge/StyleCI-passed-green.svg?style=flat-square)](https://github.styleci.io/repos/190842308) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier) [![](https://img.shields.io/badge/LICENSE-MIT-blue.svg?style=flat-square)](https://github.com/Longgererer/JS-Encoder/blob/master/LICENSE)

[中文版]('https://github.com/Longgererer/JS-Encoder/blob/master/README_EN.md')

👉 **JS-Encoder** is a open-source online compiler for the WEB 👈

[open JS-Encoder](https://longgererer.github.io/JS-Encoder/dist)

![1.png](https://i.loli.net/2019/06/26/5d1305085801b58179.png)

JS-Encoder gets some inspiration from [JS Bin](https://jsbin.com) and [CODEPEN](https://codepen.io/pen/), both of then are excellent online compiler. Built with Vue.js and Webpack.

At present JS-Encoder is in the stage of perfection!

## Interface display

[![1.jpg](https://i.loli.net/2019/07/27/5d3c2b2e3d90685570.jpg)](https://i.loli.net/2019/07/27/5d3c2b2e3d90685570.jpg)

## Features of JS-Encoder ❓

- [x] Work offline support, you can use it offline by clone repository.
- [x] Live preview.
- [x] Some preprocessing languages support, now supports `MarkDown`, `Sass`, `Scss`, `Less`, `Stylus`, `TypeScript` and `CoffeeScript`, `LiveScript` and `JSX(React)` are not supported for the time being.
- [x] Add library to your project by CDN or other url.
- [x] Local storage support, you can save your code locally, two ways support:
  - Single file: A file include HTML, CSS and JS named index.html.
  - Zip: A zip file include HTML file, CSS file and JS file.
- [x] File import support.
- [x] Color
  - Select: Click to copy the required HEX color to clipboard.
  - Switch: You can convert between HEX and RGB formats 🔄.
- [x] Personalized settings 🔧
- [x] Shortcut support, such as:

  - <kbd>Tab</kbd>:

  [![GIF.gif](https://i.loli.net/2019/07/27/5d3c17c61b95532245.gif)](https://i.loli.net/2019/07/27/5d3c17c61b95532245.gif)

  - <kbd>Ctrl</kbd> + <kbd>Space</kbd>:

  [![GIF.gif](https://i.loli.net/2019/08/02/5d440f953cdbb32371.gif)](https://i.loli.net/2019/08/02/5d440f953cdbb32371.gif)

## Work offline

```dash
git clone https://github.com/Longgererer/JS-Encoder.git
```

or use [Github Desktop](https://desktop.github.com/)

Install dependencies by yarn.

```dash
yarn
```

Run in development mode.

```dash
yarn dev
```

## Future actions ❓

- **Preprocessor support**, JS-Encoder will supports more preprocessor languages int the near future.
- **Backend**, JS-Encoder is a single page app without backend. Later, backend will have made by Node.js.
- **Code share**, share your code to another by url🔗.
- **More personalized settings**.
- Optimize the experience of user, JS-Encoder is only been in development for a few months, there has a lot of code will be optimized, this is the most needed and important question 🧐!

## Support

If you want to support **JS-Encoder**, click star 💗 to support it!

## LICENSE

[The MIT LICENSE](https://github.com/Longgererer/JS-Encoder/blob/master/LICENSE)
