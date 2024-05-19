import SingleInstance from "@utils/decorators/single-instance"
import { shallowReactive } from "vue"
import { getArrayIntersection, getType, isBaseData } from "@utils/tools"
import { AnyArray, AnyObject } from "@type/interface"
import { ConsoleMethods, ConsoleUpdateType, ITableLogInfo, LogInfo, LogType, enableConsoleMethods } from "@type/console"
import { processConsoleValueList } from "@utils/tools/console-value"

export interface IConsoleOptions {
  /** 刷新前回调 */
  onLogsUpdated?: (updateType: ConsoleUpdateType, changeLogs?: LogInfo) => void
}

@SingleInstance
export default class ConsoleService {
  /** 日志列表 */
  public logs = shallowReactive<LogInfo[]>([])
  /** iframe元素 */
  private iframe!: HTMLIFrameElement
  /** iframe中的window */
  private window!: Window & typeof globalThis
  private timeStamps: Record<string, number> = {}
  private consoleOptions: IConsoleOptions = {}

  constructor(iframe?: HTMLIFrameElement) {
    this.init(iframe)
  }

  public init(iframe?: HTMLIFrameElement) {
    if (iframe) {
      this.iframe = iframe
      this.window = this.iframe!.contentWindow as Window & typeof globalThis
      this.setConsole()
    } else {
      if (!this.iframe) {
        throw new Error("初始化Console服务配置缺失！")
      }
    }
  }

  public setOptions(options: IConsoleOptions) {
    this.consoleOptions = options
  }

  /**
   * 执行console手动输入指令
   * 由于console手动输入指令都是字符串形式，所以要先判断该命令是否会报错，加一层try catch
   * 首先将命令原样输出
   * 然后在iframe内执行命令
   * 最后输出命令的返回值
   */
  public execute(command: string) {
    let result
    this.command(command)
    try {
      result = this.window.eval(`let x=(${command});x`)
    } catch (error) {
      try {
        this.window.eval(command)
      } catch (err) {
        this.error(`${(err as Error).name}: ${(err as Error).message}`)
        return
      }
    }
    console.log(result)
    this.result(result)
  }

  public log(...args: any[]) {
    const logInfo: LogInfo = { type: LogType.MESSAGE, method: "log", data: processConsoleValueList(args) }
    this.logs.push(logInfo)
    this.triggerAddUpdate(logInfo)
  }

  public info(...args: any[]) {
    const logInfo: LogInfo = { type: LogType.INFO, method: "info", data: processConsoleValueList(args) }
    this.logs.push(logInfo)
    this.triggerAddUpdate(logInfo)
  }

  public warn(...args: any[]) {
    const logInfo: LogInfo = { type: LogType.WARN, method: "warn", data: processConsoleValueList(args) }
    this.logs.push(logInfo)
    this.triggerAddUpdate(logInfo)
  }

  public error(...args: any[]) {
    const logInfo: LogInfo = { type: LogType.ERROR, method: "error", data: processConsoleValueList(args) }
    this.logs.push(logInfo)
    this.triggerAddUpdate(logInfo)
  }

  public command(...args: any[]) {
    const logInfo: LogInfo = { type: LogType.COMMAND, method: "log", data: processConsoleValueList(args) }
    this.logs.push(logInfo)
    this.triggerAddUpdate(logInfo)
  }

  public result(...args: any[]) {
    const logInfo: LogInfo = { type: LogType.RESULT, method: "log", data: processConsoleValueList(args) }
    this.logs.push(logInfo)
    this.triggerAddUpdate(logInfo)
  }

  public time(label: string = "default") {
    this.timeStamps[label] = performance.now()
  }

  public timeLog(label: string = "default", ...args: any[]) {
    this.log(this.getTimeDurationStr(label), ...args)
  }

  public timeEnd(label: string = "default") {
    this.log(this.getTimeDurationStr(label))
    Reflect.deleteProperty(this.timeStamps, label)
  }

  public getTimeDurationStr(label: string = "default") {
    const startTime = this.timeStamps[label]
    const duration = performance.now() - startTime
    return `${label}: ${duration}ms`
  }

  public assert(...args: AnyArray) {
    const [assertion, ...restArgs] = args
    const result = this.window.eval(assertion)
    if (result) { return }
    this.error("Assertion failed: ", ...restArgs)
  }

  // eslint-disable-next-line max-lines-per-function
  public table(data: AnyObject | AnyArray, properties: string[] = []) {
    const indexHeader = "(index)"
    const valueHeader = "value"
    const headers: string[] = [indexHeader]
    const body: any[][] = []
    if (getType(data) === "Object") {
      // 如果data是对象，就取出对象的key和value作为表格的index和value即可
      headers.push(valueHeader)
      body.push(...Object.entries(data))
    } else if (getType(data) === "Array") {
      /**
       * 数组输出规则：
       * 如果传了properties
       *    那么properties里面的key值作为表格头部列
       *        如果data里面的item没有properties对应的key值，头部就添加新列“值”
       *        如果所有data里面都没有properties里面的key值，那么不展示该列
       * 如果没有传properties
       *    那么取出data里面所有的key作为表格头部列
       */
      if (properties.length) {
        const useValueHeaderIndex: number[] = []
        const keys = (data as AnyArray).reduce((acc: string[], item, index) => {
          const itemKeys = isBaseData(item) ? [] : Object.keys(item)
          const intersection = getArrayIntersection(itemKeys, properties)
          if (intersection.length) {
            acc.push(...intersection)
          } else {
            useValueHeaderIndex.push(index)
            acc.push(valueHeader)
          }
          return acc
        }, [])
        const uniqueKeys = Array.from(new Set(keys))
        headers.push(...uniqueKeys)
        const rows = (data as AnyArray).map((item, index) => {
          const cols = uniqueKeys.map((key) => {
            return key === valueHeader && useValueHeaderIndex.includes(index)
              ? item
              : item?.[key]
          })
          return [String(index), ...cols]
        })
        body.push(...rows)
      } else {
        const keys = (data as AnyArray).reduce((acc: string[], item) => {
          acc.push(...(isBaseData(item) ? [] : Object.keys(item)))
          return acc
        }, [])
        const uniqueKeys = Array.from(new Set(keys))
        headers.push(...(uniqueKeys.length ? uniqueKeys : [valueHeader]))
        const rows = (data as AnyArray).map((item, index) => {
          const cols = uniqueKeys.length
            ? uniqueKeys.map((key) => item?.[key])
            : [item]
          return [String(index), ...cols]
        })
        body.push(...rows)
      }
    }
    const logInfo: ITableLogInfo = {
      type: LogType.MESSAGE,
      method: ConsoleMethods.TABLE,
      data: { headers, body },
      origin: data,
    }
    this.logs.push(logInfo)
    this.triggerAddUpdate(logInfo)
  }

  public clear() {
    this.logs.splice(0)
    this.consoleOptions.onLogsUpdated?.(ConsoleUpdateType.CLEAR)
  }

  public triggerAddUpdate(logInfo: LogInfo) {
    this.consoleOptions.onLogsUpdated?.(ConsoleUpdateType.ADD, logInfo)
  }

  private setConsole() {
    enableConsoleMethods.forEach((method) => {
      // @ts-expect-error: method为console内部方法
      this.window.console[method] = (...args) => {
        // @ts-expect-error: 同上
        // 在浏览器控制台打印日志
        window.console[method](...args)
        this.getMethodMap(...args)[method]()
      }
    })
  }

  private getMethodMap(...args: any[]) {
    return {
      [ConsoleMethods.LOG]: () => this.log(...args),
      [ConsoleMethods.INFO]: () => this.info(...args),
      [ConsoleMethods.WARN]: () => this.warn(...args),
      [ConsoleMethods.ERROR]: () => this.error(...args),
      [ConsoleMethods.TIME]: () => this.time(...args),
      [ConsoleMethods.TIME_LOG]: () => this.timeLog(...args),
      [ConsoleMethods.TIME_END]: () => this.timeEnd(args[0]),
      [ConsoleMethods.ASSERT]: () => this.assert(...args),
      [ConsoleMethods.CLEAR]: () => this.clear(),
      [ConsoleMethods.TABLE]: () => this.table(args[0], args[1]),
    }
  }
}