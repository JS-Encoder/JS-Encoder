import { IConsoleValue } from "@type/console"

export interface IProps extends IConsoleValue {
  // 是否为简写如（Array(3)、{...}、f、Window）
  simple?: boolean
}

export interface IConsoleValueMapData {
  key: IConsoleValue
  value: IConsoleValue
}