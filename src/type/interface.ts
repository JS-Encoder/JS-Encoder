/**
 * 存放通用基础类型声明
 */

/** 项目中处理用到的类型，枚举值对应 */
export enum Type {
  NUMBER = "Number",
  STRING = "String",
  BOOLEAN = "Boolean",
  NULL = "Null",
  UNDEFINED = "Undefined",
  SYMBOL = "Symbol",
  BIGINT = "BigInt",
  REGEXP = "RegExp",
  OBJECT = "Object",
  FUNCTION = "Function",
  ERROR = "Error",
  ARRAY = "Array",
  SET = "Set",
  MAP = "Map",
  DATE = "Date",
  WINDOW = "Window",
  HTML_ELEMENT = "HTMLElement",
}

/** 对象key */
export type ObjKey = string | number | symbol

/** 通用对象类型 */
export type AnyObject = Record<ObjKey, any>

/** 通用数组类型 */
export type AnyArray = any[]

/** 通用函数类型 */
export type AnyFunction = (...args: any[]) => any

/** 什么都不返回的函数 */
export type noop = (...args: any[]) => void

/** 主题类型 */
export const enum Theme {
  DARK = "dark",
  LIGHT = "light",
}

/** 位置 */
export const enum Position {
  TOP = "top",
  RIGHT = "right",
  LEFT = "left",
  BOTTOM = "bottom",
}

/** 触发类型 */
export const enum Trigger {
  HOVER = "hover",
  CLICK = "click",
}

/** 对其方向 */
export enum Align {
  LEFT = "left",
  RIGHT = "right",
  MIDDLE = "middle",
}

/** 模态框名字 */
export const enum ModalName {
  /** 模板 */
  TEMPLATE = "template",
  /** 预处理 */
  PREPROCESSOR = "preprocessor",
  /** 编码设置 */
  CODE_SETTINGS = "codeSettings",
  /** 库 */
  LIBRARIES = "libraries",
  /** 上传代码 */
  UPLOAD_CODE = "uploadCode",
  /** 下载代码 */
  DOWNLOAD_CODE = "downloadCode",
  /** 快捷键 */
  SHORTCUT = "shortcut",
  /** 更新日志 */
  UPDATE_LOG = "updateLog",
}

/** 尺寸 */
export const enum Size {
  MINI = "mini",
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large",
  X_LARGE = "xLarge",
}

export const enum BtnType {
  DEFAULT = "default",
  PRIMARY = "primary",
  SUCCESS = "success",
  DANGER = "danger",
}

export interface ISize {
  width: number,
  height: number,
}