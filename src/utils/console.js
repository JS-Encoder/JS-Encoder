import consoleTool from './consoleTool'
import * as judge from './judgeType'
import { formatJavaScript } from './prettyFormat'

export default class Console {
  constructor(iframe) {
    if (!Console.instance) {
      this.window = iframe.contentWindow
      this.console = this.window.console
      this.consoleInfo = []
      this.consoleMethods = []
      this.ableMethods = []
      this.timerName = new Map()
      this.init()
      Console.instance = this
    }
    return Console.instance
  }
  /**
   * 执行console手动输入指令
   * 由于console手动输入指令都是字符串形式，所以要先判断该命令是否会报错，加一层try catch
   * 首先将命令原样输出
   * 然后在iframe内执行命令
   * 最后输出命令的返回值
   * @param String cmd
   */
  executeCommand (cmd) {
    let returnVal
    this.console.log(cmd)
    try {
      returnVal = this.window.eval(cmd)
    } catch (e) {
      this.consoleInfo.push({
        type: 'error',
        content: e
      })
      return
    }
    this.printLog({
      type: 'print',
      content: [returnVal]
    }).then(finLog => {
      if (finLog.type === 'mixed') finLog.type = 'mixedPrint'
      this.consoleInfo.push(finLog)
    })
  }
  /**
   * @param Element iframe 重新载入过后的iframe
   */
  refreshConsole (iframe) {
    // 因为执行代码时需要先将iframe重新载入，重新载入iframe需要重新做一次constructor中的操作
    this.window = iframe.contentWindow
    this.console = this.window.console
    this.timerName = new Map()
    this.init()
  }
  /**
   * 获取所有日志
   * @return consoleInfo
   */
  getConsoleInfo () {
    return this.consoleInfo
  }
  /**
   * @param Array content 日志内容
   * 设置日志内容
   */
  setConsoleInfo (content) {
    const consoleInfo = this.consoleInfo
    consoleInfo.splice(0, consoleInfo.length, content)
    consoleInfo.pop()
  }
  /**
   * 判断该方法是否可用
   * @param String methodStr
   * @return Boolean
   */
  judgeMethodsAllowed (methodStr) {
    return this.ableMethods.indexOf(methodStr) > -1 ? true : false
  }
  /**
   * 初始化控制台
   */
  init () {
    this.consoleMethods = ['log', 'info', 'warn', 'error', 'dir', 'debug', 'time', 'timeLog', 'timeEnd', 'clear']
    this.ableMethods = ['log', 'dir', 'info', 'warn', 'error']
    const consoleInfo = this.consoleInfo
    const iframeConsole = this.console
    // 重写window的onerror事件
    this.window.onerror = (msg, _, row, col) => {
      consoleInfo.push({
        type: 'system-error',
        content: msg,
        row,
        col
      })
      return false
    }
    // 重写console的一些方法
    this.consoleMethods.forEach(item => {
      iframeConsole[item] = (...arg) => {
        // 在浏览器控制台打印日志
        console[item](...arg)
        switch (item) {
          // console.time,console.timeEnd,console.timeLog都只接收第一个参数
          case 'time':
            this.setTimer(arg[0])
            break
          case 'timeLog': {
            const time = this.calcTime(arg[0])
            const finContent = time ? this.renderNumber(time) : this.renderUndefined(time)
            consoleInfo.push({
              type: 'log',
              logs: [finContent]
            })
            break
          }
          case 'timeEnd': {
            const time = this.calcTime(arg[0])
            const finContent = time ? this.renderNumber(time) : this.renderUndefined(time)
            consoleInfo.push({
              type: 'log',
              logs: [finContent]
            })
            break
          }
          case 'clear': {
            this.setConsoleInfo('')
            break
          }
          default: {
            // 先判断参数中是否含有global或window
            let haveLargeOb = false
            arg.forEach(item => {
              if (consoleTool.judgeWindow(item)) {
                consoleInfo.push({
                  type: 'error',
                  content: 'Sorry, this log was too large for our console. You might need to use the browser console instead.'
                })
                haveLargeOb = true
              }
            })
            if (haveLargeOb) return
            this.printLog({
              type: item,
              content: arg
            }).then(finLog => {
              consoleInfo.push(finLog)
            })
          }
        }
      }
    })
  }
  /**
   * 设置计时器
   * @param String name 计时器名称
   */
  setTimer (name) {
    // 如果该计时器已存在就不做操作
    const timerName = this.timerName
    if (timerName.get(name)) return void 0
    timerName.set(name, performance.now())
  }
  /**
   * 计算时间
   * @param String name 计时器名称
   * @return time 时间差
   */
  calcTime (name) {
    // 如果不存在该计时器，返回undefined
    const time = this.timerName.get(name)
    if (!time) return void 0
    return `${name}: ${performance.now() - time} ms`
  }
  /**
   * @param String name 计时器名称
   */
  getTimer (name) {
    const time = this.calcTime(name)
    this.timerName.delete(name)
    return time
  }
  /**
   * 将日志打印到日志显示窗口
   * @param Object item
   * @param String type 日志类型  log|info|debug|error|warn 必要！
   * @param Array content 日志内容
   * @return finLog 最终显示在页面上的日志html
   */
  async printLog (item) {
    const type = item.type
    let content = item.content
    if (!this.judgeMethodsAllowed(type) && type !== 'print') {
      return {
        type: 'warn',
        content: `console.${type} is not a function`
      }
    }
    let finLog = {}
    switch (type) {
      case 'log':
      case 'dir':
      case 'print':
        // 先判断是否为基本数组（所有元素都是基本类型的数组），如果不是基本类型数组，就定为mixed类型，放到codeMirror组件中
        if (!consoleTool.judgeBaseArray(content)) {
          await formatJavaScript(this.switchContentToString(content)).then(finStr => {
            content = finStr
          })
          finLog = {
            type: 'mixed',
            content
          }
        } else {
          finLog = {
            type, logs: this.log(content)
          }
        }
        break
      case 'info':
      case 'warn':
      case 'error': {
        await formatJavaScript(this.switchContentToString(content)).then(finStr => {
          content = finStr
        })
        finLog = {
          type, content
        }
      }
    }
    return finLog
  }
  switchContentToString (content) {
    // 由于error和warn与log的显示样式不同，需要做不同处理，直接将content的内容转化为字符串
    let finStr = ''
    const length = content.length
    const afterStr = ' '
    content.forEach((item, index) => {
      let type = judge.judgeType(item)
      if (/^HTML/.test(type) && type !== 'HTMLCollection') type = 'dom'
      switch (type) {
        case null:
        case 'undefined':
        case 'symbol':
        case 'number':
        case 'boolean':
        case 'function':
          finStr = finStr + String(item)
          if (index !== length - 1) finStr = finStr + afterStr
          break
        case 'string':
          finStr = `${finStr}"${String(item)}"`
          if (index !== length - 1) finStr = finStr + afterStr
          break
        case 'Array':
        case 'Map':
        case 'Object':
          finStr = finStr + consoleTool.JSONStringify(item) + afterStr
          break
        case 'dom':
          finStr = finStr + consoleTool.stringifyDOM(item)
          break
        case 'HTMLCollection':
          for (let i = 0;i < item.length;i++) {
            finStr = finStr + consoleTool.stringifyDOM(item[i]) + '\n'
          }
          break
        default:
      }
    })
    return finStr
  }
  /**
   * 生成带有log的html字符串
   * @param Array content 输出内容
   * @return finLog 最终显示在页面上的日志
   */
  log (content) {
    const finLog = []
    if (!content.length) return ''
    content.forEach(item => {
      const type = judge.judgeType(item)
      let html = ''
      switch (type) {
        case 'string':
          html = this.renderString(item)
          break
        case 'number':
          html = this.renderNumber(item)
          break
        case 'boolean':
          html = this.renderBoolean(item)
          break
        case 'symbol':
          html = this.renderSymbol(item)
          break
        case null:
          html = this.renderNull(item)
          break
        case 'undefined':
          html = this.renderUndefined(item)
          break
      }
      finLog.push(html)
    })
    return finLog
  }
  /**
   * @param Boolean bool
   * @param Symbol sym
   * @param Null nul
   * @param Undefined und
   * @param String str 
   * @param Number num
   * @return String html string
   */
  renderString (str) {
    return `<span class="cm-string">"${str}"</span>`
  }
  renderNumber (num) {
    return `<span class="cm-number">${num}</span>`
  }
  renderBoolean (bool) {
    return `<span class="cm-atom">${bool}</span>`
  }
  renderSymbol (sym) {
    sym = String(sym)
    return `<span class="cm-variable">${sym}</span>`
  }
  renderNull (nul) {
    return `<span style="color: #6a6a6a">${nul}</span>`
  }
  renderUndefined (und) {
    return `<span style="color: #6a6a6a">${und}</span>`
  }
}