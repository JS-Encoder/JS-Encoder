export default {
  language: 'zh',
  visibleDialog: '',
  preprocessor: ['HTML', 'CSS', 'JavaScript'],
  currentTab: 'HTML',
  mdToolbarVisible: false,
  instanceCode: {
    HTML: '<h1>Welcome to JS-Encoder!</h1>',
    CSS: '',
    JavaScript: '',
  },
  instanceSetting: {
    delayTime: 500,
    autoExecute: true,
    autoComplete: true,
    tabIndent: true,
    lint: true,
    lineWrap: true,
    indentSpaces: 2,
    fontFamily: 'Consolas',
    fontSize: 14,
    headTags: ''
  },
  instanceExtLinks: {
    cssLinks: [],
    JSLinks: [],
  },
  iframeScreenVisible: false,
  consoleHeight: 150,
  iframeHeight: 0,
  editorWidth: 0,
  iframeWidth: 0,
  iframeHeightVisible: false,
  iframeWidthVisible: false,
  resolveHTML: true,
  consoleSettings: {
    clear: true,
    highlight: true,
  },
  consoleInfo: [],
  consoleInfoCount: {
    error: 0,
    warn: 0,
    info: 0,
    sum: 0
  },
  hasUploadCode: false,
  shouldResetCode: false,
  /**
   * 组件模式，一旦cpntMode为true，则只显示一个编辑窗口
   * 开启组件模式则不能设置preprocessor，窗口切换快捷键也无效
   */
  cpntMode: false,
  // 组件名称，现支持：Vue2、Vue3
  cpntName: '',
  // 组件代码
  cpntCode: ''
}
