import { judgeBaseArray, judgeType, judgeWindow, JSONStringify, judgeCyclic, stringifyDOM } from './tools'
import { simpleFormat } from './codeFormatter'

const highlightMap = {
  string: 'cm-string',
  number: 'cm-number',
  bigint: 'cm-none',
  boolean: 'cm-atom',
  symbol: 'cm-variable',
  null: 'cm-none',
  undefined: 'cm-none',
}

export default class Console {
  constructor(iframe) {
    if (!Console.instance) {
      this.window = iframe.contentWindow
      this.console = this.window.console
      this.consoleInfo = []
      this.timerMap = new Map()
      this.init()
      Console.instance = this
    }
    return Console.instance
  }
  /**
   * 初始化控制台各个可用方法
   */
  init () {
    this.consoleMethods = ['log', 'info', 'warn', 'error', 'assert', 'dir', 'debug', 'time', 'timeLog', 'timeEnd', 'clear']
    this.ableMethods = ['log', 'dir', 'info', 'warn', 'error', 'assert']
    const consoleInfo = this.consoleInfo
    const iframeConsole = this.console
    // this.window.exeJSEncoderConsoleCmd = cmd => Function(`return (${cmd})`)()
    this.consoleMethods.forEach((item) => {
      iframeConsole[item] = (...arg) => {
        console[item](...arg) // 在浏览器控制台打印日志
        switch (item) {
          case 'time':
            this.setTimer(arg[0])
            break
          case 'timeLog':
          case 'timeEnd': {
            const time = this.calcTime(arg[0])
            const domClass = time ? highlightMap.number : highlightMap.undefined
            const finContent = `<span class="${domClass}">${time}</span>`
            consoleInfo.push({
              type: 'log',
              logs: [finContent],
            })
            break
          }
          case 'clear': {
            this.clear()
            break
          }
          case 'assert': {
            const result = this.window.eval(arg.splice(0, 1)[0])
            if (!result) {
              const finLog = this.print({
                type: 'log',
                content: arg,
              })
              finLog.type = 'error'
              finLog.content = `Assertion failed: ${finLog.content}`
              consoleInfo.push(finLog)
            }
            break
          }
          default: {
            // 先判断参数中是否含有global或window
            let haveLargeOb = false
            arg.forEach((item) => {
              if (judgeWindow(item)) {
                consoleInfo.push({
                  type: 'error',
                  content:
                    'Sorry, this log was too large for our console. You might need to use the browser console instead.',
                })
                haveLargeOb = true
              }
            })
            if (haveLargeOb) return void 0
            const finLog = this.print({
              type: item,
              content: arg,
            })
            consoleInfo.push(finLog)
          }
        }
      }
    })
  }
  /**
   * 清除控制台所有日志
   */
  clear () {
    const consoleInfo = this.consoleInfo
    consoleInfo.splice(0, consoleInfo.length, '')
    consoleInfo.pop()
  }
  /**
   * 获取日志列表
   * @returns {Array}
   */
  getLogs () {
    return this.consoleInfo
  }
  /**
   * 刷新控制台，因为执行代码时需要先将iframe重新载入，重新载入iframe需要重新做一次constructor中的操作
   */
  refresh (iframe) {
    this.window = iframe.contentWindow
    this.console = this.window.console
    this.timerMap = new Map()
    this.init()
  }
  /**
   * 执行console手动输入指令
   * 由于console手动输入指令都是字符串形式，所以要先判断该命令是否会报错，加一层try catch
   * 首先将命令原样输出
   * 然后在iframe内执行命令
   * 最后输出命令的返回值
   * @param {String} cmd
   */
  exeCmd (cmd) {
    let result
    this.console.log(cmd)
    try {
      // if (/^(let|const)+( )/.test(cmd)) {
      //   result = this.window.eval(cmd)
      // } else {
      //   result = this.window.exeJSEncoderConsoleCmd(cmd)
      // }
      if (cmd === 'window' || cmd === 'console') {
        this.consoleInfo.push({
          type: 'error',
          content: 'Sorry, this log was too large for our console. You might need to use the browser console instead.',
        })
        console.log(this.window.eval(cmd))
        return void 0
      }
      result = this.window.eval(`let x=(${cmd});x`)
    } catch (err) {
      try {
        this.window.eval(cmd)
      } catch (err) {
        this.consoleInfo.push({
          type: 'error',
          content: err,
        })
        return void 0
      }
    }
    console.log(result)
    const log = this.print({
      type: 'print',
      content: [result],
    })
    log.type === 'mix' && (log.type = 'mixPrint')
    this.consoleInfo.push(log)
  }
  /**
   * 设置计时器，如果该计时器已存在就不做操作
   * @param {String} name 计时器名称
   */
  setTimer (name) {
    const timerMap = this.timerMap
    if (timerMap.get(name)) return void 0
    timerMap.set(name, performance.now())
  }
  /**
   * @param {String} name 计时器名称
   * @returns {Number}
   */
  getTimer (name) {
    const time = this.calcTime(name)
    this.timerMap.delete(name)
    return time
  }
  /**
   * 计算时间，如果不存在该计时器，返回undefined
   * @param {String} name 计时器名称
   * @returns {Number} time 时间差
   */
  calcTime (name) {
    const time = this.timerMap.get(name)
    if (!time) return void 0
    return `${name}: ${performance.now() - time} ms`
  }
  /**
   * 生成日志
   * 如果该方法并不支持，发出警告
   * 内容判断是否为基本数组（所有元素都是基本类型的数组），如果不是基本类型数组，就定为mix类型，放到codeMirror组件中
   * @param {Object} item
   * @param {String} type 日志类型  log|info|debug|error|warn 必要！
   * @param {Array} content 日志内容
   * @returns {Object} finLog 最终显示在页面上的日志信息
   */
  print (item) {
    let { type, content } = item
    if (!(this.ableMethods.indexOf(type) >= 0) && type !== 'print') {
      return {
        type: 'warn',
        content: `console.${type} is not supported in this console, please use the browser console for debugging!`,
      }
    }
    let finLog = {}
    switch (type) {
      case 'log':
      case 'dir':
      case 'print':
        if (!judgeBaseArray(content)) {
          content = simpleFormat(this.contentToString(content))
          finLog = {
            type: 'mix',
            content,
          }
        } else {
          finLog = {
            type,
            logs: this.log(content),
          }
        }
        break
      case 'info':
      case 'warn':
      case 'error': {
        content = simpleFormat(this.contentToString(content))
        finLog = {
          type,
          content,
        }
      }
    }
    return finLog
  }
  /**
   * 将log内容转换成字符串
   * 由于error和warn与log的显示样式不同，需要做不同处理，直接将content的内容转化为字符串
   * @param {Array} content
   * @returns {String}
   */
  contentToString (content) {
    let result = ''
    const length = content.length
    const afterStr = ' '
    content.forEach((item, index) => {
      let type = judgeType(item)
      if (/^HTML/.test(type) && type !== 'HTMLCollection') type = 'dom'
      switch (type) {
        case 'null':
        case 'undefined':
        case 'symbol':
        case 'number':
        case 'boolean':
        case 'function':
          result += String(item)
          if (index !== length - 1) result += afterStr
          break
        case 'string':
          result = `${result}"${String(item)}"`
          if (index !== length - 1) result += afterStr
          break
        case 'bigint':
          result += `${item.toString()}n`
          if (index !== length - 1) result += afterStr
          break
        case 'String':
        case 'Number':
        case 'Boolean':
          if (type === 'String') item = `"${item}"`
          result = `${result}${type}{${item}}`
          if (index !== length - 1) result += afterStr
          break
        case 'Array':
        case 'Map':
        case 'Set':
        case 'Error':
        case 'Date':
        case 'RegExp':
        case 'Object':
          if (judgeCyclic(item)) {
            result = 'JSEncoder Tip: "There is a circular reference in the output variable, please view the full log in the browser console."'
          } else {
            result = result + JSONStringify(item) + afterStr
          }
          break
        case 'dom':
          result = result + stringifyDOM(item)
          break
        case 'HTMLCollection':
          for (let i = 0;i < item.length;i++) {
            result = result + stringifyDOM(item[i]) + '\n'
          }
          break
        default:
          result = 'JSEncoder Tip: "We do not support the display of this data type at this time, if you want to help us, please fork our project on Github."'
      }
    })
    return result
  }
  /**
   * 生成带有log的html字符串
   * @param {Array} content 输出内容
   * @returns {Array} finLog 最终显示在页面上的日志
   */
  log (content) {
    const result = []
    if (!content.length) return ''
    content.forEach((item) => {
      const type = judgeType(item)
      if (type === 'symbol') {
        item = String(item)
      } else if (type === 'bigint') {
        item = `${item.toString()}n`
      }
      const domClass = highlightMap[type]
      const html = `<span class="${domClass}">${item}</span>`
      result.push(html)
    })
    return result
  }
}
