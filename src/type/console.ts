/** 日志类型 */
export const enum LogType {
  /** 普通日志 */
  MESSAGE = "message",
  /** 提示日志 */
  INFO = "info",
  /** 警告日志 */
  WARN = "warn",
  /** 错误日志 */
  ERROR = "error",
  /** 执行指令输入日志 */
  COMMAND = "command",
  /** 执行指令输出日志 */
  RESULT = "result",
}

export enum ConsoleMethods {
  LOG = "log",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
  ASSERT = "assert",
  TIME = "time",
  TIME_LOG = "timeLog",
  TIME_END = "timeEnd",
  CLEAR = "clear",
  TABLE = "table",
}

export const ConsoleMethod2LogType = {
  [ConsoleMethods.LOG]: LogType.MESSAGE,
  [ConsoleMethods.INFO]: LogType.INFO,
  [ConsoleMethods.WARN]: LogType.WARN,
  [ConsoleMethods.ERROR]: LogType.ERROR,
}

/** 所有支持的console方法 */
export const enableConsoleMethods = Object.values(ConsoleMethods)

export type LogInfo = IBasicLogInfo | ITableLogInfo

export type BasicLogMethod = "log" | "info" | "warn" | "error"

export const basicLogMethods = ["log", "info", "warn", "error"]

export interface IBasicLogInfo {
  type: LogType
  method: "log" | "info" | "warn" | "error" | "assert" | "time" | "timeLog" | "timeEnd"
  data: any[]
}

export interface ITableLogInfo {
  type: LogType.MESSAGE
  method: ConsoleMethods.TABLE
  data: { headers: string[], body: any[][] }
  /** 处理之前的原始数据 */
  origin: any
}

export enum ConsoleUpdateType {
  CLEAR = "clear",
  ADD = "add",
}

export interface IConsoleValue {
  type: string
  value: any
  name?: string
  /** 前缀 */
  prefix?: string
  /** 后缀 */
  suffix?: string
  /** 属性列表 */
  attrs?: Array<{ key: number | string, value: any }>
  /** 大小，如Array(3)、NodeList(3)、Set(3)、Map(3) */
  size?: number
  /** Symbol(Symbol.toStringTag) */
  toStringTag?: string
  /** 最少展示出来的属性数，默认为0表示不限制，在unfold为false情况下有效，剩下的用省略号表示 */
  minLength?: number
  /** 最多展示出来的属性数，默认为0表示不限制，在unfold为true情况下有效，剩下的用省略号表示 */
  maxLength?: number
  /** 是否为链接，字符串类型可用 */
  isLink?: boolean
}