# Compiler ol

**一个 HTML + CSS + JS 在线编译器**

![未标题-1.png](https://i.loli.net/2019/06/26/5d1305085801b58179.png)

本编译器从[JS Bin](https://jsbin.com/?html,output)和[CODEPEN](https://codepen.io/pen/)这两个优秀的编译器中获得灵感,采用 Vue 框架,element-ui 和[CodeMirror](https://codemirror.net/)工具制作。

**CodeMirror**是一个功能非常强大的代码编译器,支持多种语言,功能多样且有多个主题样式

调用**CodeMirror**的 API 涉及到 DOM 操作,所以可以安装[vue-codemirror](https://www.npmjs.com/package/vue-codemirror)包来代替 CodeMirror

`npm install vue-codemirror --save`

---

一共有五个窗口： `HTML`, `CSS`, `JavaScript`, `Console` 和 `Output`

`Console` 显示控制台输出的信息

`Output` 显示效果

本人不才,现在编译器功能还很少,而且有些功能还没完善,比如自定义缩进等,还有很多 bug 需要发现并解决,之后会继续修复并且添加更多功能

### 2019-6-16 更新

- `Console` 窗口增加 `clear` 功能
- 添加智能提示功能
- 修复 `document.write` 导致重写 `html` 的问题
- 修复滚动条显示问题
- 修复代码窗宽度改变后光标位置问题

### 2019-6-17 更新

- 优化部分用户体验
- 添加代码折叠功能

### 2019-6-22 更新

- 修复 `Output` 窗口拖动卡顿问题
- 优化部分用户体验

### 2019-6-23 更新

- 修复空格过小问题
- 添加 `tab-space` 选项（2 或者 4）
- 添加若干快捷键

### 2019-6-24 更新

- 优化部分用户体验
- 添加下载功能，可将编辑器中的代码下载到本地
  - 单文件下载（HTML，CSS 和 JS 合并成一个文件 index.html）
  - 多文件下载（HTML，CSS 和 JS 分离成三个文件并放在文件夹中）**此为压缩文件**

### 2019-6-25 更新

- 修复若干 BUG
- 优化部分用户体验
- 添加部分设置功能

### 2019-6-26 更新

- 优化界面

### 2019-6-27 更新

- 支持(CSS, JS)外部链接

### 2019-6-28 更新

- 优化界面

### 2019-6-29 更新

- 支持**MarkDown**语法
