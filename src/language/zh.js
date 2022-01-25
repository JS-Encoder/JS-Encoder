module.exports = {
  dialog: {
    title: '提示',
    confirm: '确认',
    cancel: '取消',
  },
  dialogs: {
    templates: {
      title: '模板',
      describe: '选择你的初始模板',
      show: '不再自动显示'
    },
    library: {
      title: '库',
      loading: '加载中...',
      empty: '无匹配库',
      style: {
        title: '外部样式',
        describe: '你所添加的外部样式，将按照顺序在本地CSS执行之前依次执行，支持http和https协议链接',
        searchPlaceHolder: '查找外部样式...',
        add: '添加外部样式',
      },
      script: {
        title: '外部脚本',
        describe: '你所添加的外部样式，将按照顺序在本地JavaScript执行之前依次执行，支持http和https协议链接',
        searchPlaceHolder: '查找外部脚本...',
        add: '添加外部脚本',
      },
    },
    preprocessor: {
      title: '预处理语言',
      describe: '由于你使用了组件模式，因此你无法设置预处理语言'
    },
    upload: {
      title: '上传文件',
      preDescribe: '上传本地文件，格式包含 ',
      mimeType: 'html, md, pug, css, sass, scss, less, styl, js, ts, coffee, ',
      aftDescribe: '文件内容将覆盖对应编辑窗口的内容。',
      resolveHTML: '分解html文件',
      resolveDescribe:
        '选中此选项，编辑器将会把html文件中的html, css和javascript代码以及外部链接分离，代码会覆盖对应编辑器的代码，外部链接会自动添加到库中。',
      chooseBtn: '选择文件',
      fileList: '上传文件列表',
      uploadBtn: '上传',
    },
    settings: {
      title: '设置',
      time: {
        title: '延迟执行时间',
        describe: '当你完成代码后，我们将等待一段时间后执行它',
      },
      autoExecute: {
        title: '自动执行',
        describe: '选中此选项将会自动执行代码，如果没有选中则需点击执行按钮执行代码',
      },
      autoComplete: {
        title: '代码提示',
      },
      lint: {
        title: '代码规范检查',
        describe: '启用此项将对代码进行规范检查，目前暂不支持预处理语言的检查',
      },
      lineWrap: {
        title: '代码超出编辑窗口宽度后换行显示',
      },
      indent: {
        title: '代码缩进',
        tabIndent: '用Tab替换等同于Tab宽度的空格',
        indentSpaces: '缩进空格数',
      },
      fonts: {
        title: '字体',
        fontFamily: '字体名',
        fontSize: '字体大小',
      },
      headTags: {
        title: '头部标签',
        describe: '输入你想在 <head> 中添加的标签如 <meta...>'
      }
    },
    download: {
      title: '文件下载',
      single: {
        title: '单文件',
        describe: '将html，css和js整合成一个html文件',
      },
      multiple: {
        title: '多文件',
        describe: '生成html，css和js三个文件并放入文件夹中',
      },
      preCompile: {
        title: '下载编译前的文件',
        describe: '如果你使用了预处理语言，选中此选项将会下载未编译前的文件',
      },
      downloadBtn: '下载',
    },
    shortcuts: {
      title: '快捷键',
      common: '通用',
      markdownList: [
        '加粗',
        '倾斜',
        '中划线',
        '链接',
        '图片',
        '引用',
        '代码块',
        '无序列表',
        '有序列表',
        '横线',
        '列表延伸',
      ],
      commonList: [
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
        '跳至某行',
      ],
    },
  },
  instance: {
    loader: {
      init: '初始化实例中，请稍等...',
      load: '加载实例中，请稍等...',
    },
    header: {
      instanceInfo: {
        name: '实例名',
        describe: '实例描述...',
        save: '保存',
      },
    },
    sidebar: ['模板', '预处理语言', '库', '设置', '上传', '下载', '快捷键', '中英文切换', 'Github'],
    editorTools: ['格式化代码'],
    viewTools: {
      refresh: '刷新',
      fullScreen: '全屏',
    },
  },
  console: {
    tools: {
      filters: '过滤器',
      settings: '设置',
      recycle: '清除日志',
      minimal: '最小化',
    },
    settings: {
      clear: {
        title: '自动清除历史日志',
        describe: '选中此选项将会在每次执行代码之前清除先前生成的历史日志，你可以选择保留历史日志，但可能会影响性能',
      },
      highlight: {
        title: '代码高亮',
        describe: '选中此选项，日志内容将被高亮渲染',
      },
    },
  },
}
