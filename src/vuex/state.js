export default {
  // 用户信息
  userInfo: {
    avatarUrl: '',
    name: '',
    nickName: '',
    _id: ''
  },
  // 网站语言
  language: 'zh',
  // 浏览器宽度
  clientWidth: 0,
  // 侧边栏状态
  sidebarStatus: false,
  // 当前对话框
  currentDialog: '',
  // 当前显示二级选项栏
  currentSecOpt: '',
  // 当前显示代码窗口
  currentTab: 'HTML',
  // 控制台尺寸
  consoleSize: 0,
  // 代码窗口高度
  codeAreaHeight: 0,
  // 代码窗口宽度
  codeAreaWidth: 0,
  // 当前项目id
  projectId: '',
  // 当前项目名称
  projectName: '',
  // 当前项目封面key
  posterKey: '',
  // 预处理语言
  preprocess: [
    'HTML',
    'CSS',
    'JavaScript'
  ],
  // 项目标签
  tags: [],
  // 代码窗内容
  codeAreaContent: {
    HTML: '',
    CSS: '',
    JavaScript: ''
  },
  // 当前项目是否已存在（是否已经存储到数据库过）
  isProjectExist:false,
  // js外部链接
  CDNList: [],
  // css外部链接
  linkList: [],
  // 是否显示遮罩层
  showBg: false,
  // 是否显示侧边用户信息栏
  showSlideUserMenu: false,
  // 是否显示储存按钮
  showSaveBtn: false,
  // 是否显示储存提示
  showSaveTip: true,
  // 用户登录状态
  loginStatus: false,
  // 设置项
  codeOptions: {
    replace: true,
    autoUp: true,
    waitTime: 1000,
    showHistoryLog: false,
    tabIndent: 2
  },
  // iframe宽度
  iframeWidth: 0,
  // iframe遮罩层
  iframeScreen: false,
  // 显示iframe高度
  showIframeHeight: false,
  // 显示iframe宽度
  showIframeWidth: false,
  // 日志列表
  consoleInfo: [],
  // console过滤器
  isFilterShow: false,
  filterList: [
    'log',
    'info',
    'warn',
    'error'
  ],
  showPageLoader: false
}
