module.exports = {
  // 浏览器版本提醒
  browserTip: '请使用最新版chrome以获取最佳体验!',
  // 代码页面侧边栏
  sbOpt: [
    '设置',
    '上传&下载',
    '色彩',
    '语言',
    '新功能',
    '问题',
    'Github'
  ],
  // 用户界面侧边栏
  userSbOpt: [
    '新建项目',
    '个人设置',
    '语言',
    '新功能',
    'Github',
    '登出'
  ],
  // 支持
  support: {
    title: '想支持 JS-ENCODER?',
    content: '那就打赏一下作者吧!',
    btn: '支持我!'
  },
  // 页脚
  footer: {
    describe: '一个可供用户在线编写并存储代码的平台',
    function: '功能介绍',
    email: 'Email',
    github: 'GitHub',
    MIT: '遵循协议',
    log: '更新日志'
  },
  // 用户项目信息
  profileInfo: {
    projectNum: '项目：',
    recycleNum: '回收站：',
    filter: {
      search: {
        name: '项目名',
        placeholder: '查询项目名'
      },
      tags: {
        name: '标签',
        placeholder: '查询标签'
      },
      sort: {
        name: '排序',
        placeholder: '选择排序方式',
        sortList: [
          {
            value: '创建时间',
            label: 'DateCreated'
          },
          {
            value: '更新时间',
            label: 'DateUpdated'
          }
        ]
      },
      order: {
        name: '顺序'
      }
    },
    projectDetail: {
      projectMenuList: ['标签', '编辑', '删除', '恢复'],
      rename: '重命名项目',
    },
    projectType: ['项目', '回收站', '搜索'],
    blankTip: '没有项目',
    create: '去创建',
    blankCycle: '空空如也',
    deleteTip: {
      title: '删除项目',
      content: '确认删除当前项目？',
      cancel: '取消',
      confirm: '删除',
      describe: '删除的项目会储存在回收站中，两星期后清空',
      success: '项目已移入回收站',
      fail: '项目删除失败'
    },
    tagsTip: {
      title: '修改标签',
      cancel: '取消',
      confirm: '确认修改',
      success: '修改标签成功',
      fail: '修改标签失败'
    },
    recoverTip: {
      title: '恢复项目',
      content: '确认恢复项目？',
      describe: '项目将恢复为未回收状态',
      cancel: '取消',
      confirm: '确认恢复',
      success: '恢复项目成功',
      fail: '恢复项目失败'
    }
  },
  // 侧边栏延申
  secSbOpt: {
    conf: ['预处理', '库', '其他'],
    ud: ['上传', '下载'],
    color: ['颜色转换', '颜色选择'],
    lang: ['简体中文', 'English'],
    help: ['快捷键', '反馈']
  },
  tabsCommands: [
    'Run'
  ],
  tabsMenu: [
    '清空代码',
    '全屏查看'
  ],
  slideUserMenu: [
    '工作空间',
    '个人设置',
    '回收站',
    '登出'
  ],
  loginHint: '登陆以查看用户信息',
  loginBtn: '使用 github 登陆',
  dialogInfo: {
    preprocessor: {
      title: '预处理'
    },
    library: {
      title: '库',
      cssTitle: '添加外部样式',
      jsTitle: '添加外部脚本',
      cssDescribe: '这里添加的链接都是在运行 JavaScript 之前按顺序运行的，这些链接支持 HTTP 或 HTTPS 协议',
      jsDescribe: '这里添加的链接都是在运行 JavaScript 之前按顺序运行的，这些链接支持 HTTP 或 HTTPS 协议',
      add: '添加'
    },
    more: {
      title: '更多设置',
      waitTime: '延迟执行时间',
      waitTimeDescribe: '在您完成代码之后，我们将等待一段时间来执行它',
      autoExecute: '自动执行',
      autoExecuteDescribe: '打开自动执行会自动更新视图，关闭这个选项则需要在点击执行按钮时更新视图',
      replaceTab: '用 Tab 替换等同于 Tab 宽度的空格',
      showHistoryLog: '显示Console历史日志',
      showHistoryLogDescribe: '该选项被选中时，Console历史日志不会因为代码的更新而清除，但可能影响性能',
      tabIndent: 'Tab缩进数'
    },
    upload: {
      title: '上传',
      describe: '上传本地文件，格式包含 html, css, js, md, sass, scss, less, styl, ts 和 coffee。文件内容覆盖编辑器内容',
      chooseBtn: '选择文件',
      uploadBtn: '上传',
      chooseFiles: '已选择的文件',
      fileWarn: '只显示符合格式要求的文件'
    },
    download: {
      title: '下载',
      singleFileTitle: '单文件下载',
      singleFileDescribe: '将 HTML、CSS、JS 整合成一个HTML文件',
      multiFileTitle: '多文件下载',
      multiFileDescribe: '将 HTML、CSS、JS 分成三个文件放在文件夹中',
      beforeCompile: '下载编译前的文件',
      downloadBtn: '下载'
    },
    switch: {
      title: '颜色格式转换',
      switchDescribe: 'RGB 和 HEX 格式转换'
    },
    select: {
      title: '颜色选择',
      selectDescribe: '点击复制 HEX 格式颜色到剪贴板',
      GAndB: '绿/蓝',
      RAndB: '红/蓝',
      RAndG: '红/绿',
      Gray: '灰',
      inform: 'HEX颜色已添加到剪切板'
    },
    newFeature: {
      title: '新特性',
      featureList: [
      ],
      noFeature: '暂无更新'
    },
    shortcut: {
      title: '快捷键',
      common: '通用',
      markdown: 'Markdown',
      markdownList:[
        '加粗',
        '倾斜',
        '删除线',
        '链接',
        '图片',
        '引用',
        '代码',
        '无序列表',
        '有序列表',
        '横线',
        '列表延伸'
      ],
      shortcutList: [
        '缩进代码',
        '格式化代码',
        '智能提示',
        '收起代码',
        '注释',
        '行复制',
        '选择当前行',
        '向上互换行',
        '向下互换行',
        '聚焦HTML编辑器',
        '聚焦CSS编辑器',
        '聚焦JS编辑器',
        '左缩进代码',
        '右缩进代码',
        '代码查询',
        '代码替换',
        '跳至某行'
      ]
    },
    feedback: {
      title: '反馈',
      feedbackDescribe: '如果您发现了 bug，您可以在 github 上提供反馈',
      toFeedback: '去反馈'
    },
    newProject: {
      title: '新建项目',
      name: '项目名',
      tagsDescribe: '为你的项目添加标签(按下回车键添加，不超过三个)',
      tags: '标签'
    },
    personalSetting: {
      title: '个人设置',
      clearLocal: '清除本地Cookie',
      clearDescribe: 'Cookie中包含个人设置以及其他信息',
      clearBtn: '清除',
      clearInfo: 'Cookie已清除',
      defaultPrep: '默认预处理语言',
      defaultCode: '默认初始代码',
      codePlaceholder: '请输入初始代码'
    },
    welcome: {
      title: 'JS-ENCODER',
      first: '：)欢迎使用',
      introduce: 'JS-ENCODER 是一个可以供用户在线编辑，保存前端代码的一个平台。\nJS-ENCODER 支持多种前端语言（包含预处理语言）的编译，外部链接引入，还提供了文件上传、下载、快捷键、颜色板等多种辅助功能。',
      important: '最最最重要的是，JS-ENCODER 不需要打开本地编辑器软件，就可以流畅的编辑代码并实时显示效果！！！',
      try: '还等什么？赶快来体验一下吧！'
    },
    logOut: {
      title: '登出',
      describe: '登出后将退出当前账户，本地保留任何用户配置信息都将被清除',
      describeExtra: '直到您下次登陆成功之前，进入 JS-ENCODER 时都无法自动登陆',
      content: '确认登出 JS-ENCODER？',
      confirm: '登出',
      cancel: '算了'
    }
  }
}