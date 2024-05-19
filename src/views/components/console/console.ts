import { ISelectOption } from "@components/form/custom-select/custom-select"
import { LogType } from "@type/console"
import { reactive } from "vue"

/** 日志过滤选项列表 */
export const filterSelectOptions: ISelectOption[] = [
  { value: null, label: "All" },
  { value: LogType.MESSAGE, label: "Message" },
  { value: LogType.INFO, label: "Info" },
  { value: LogType.WARN, label: "Warn" },
  { value: LogType.ERROR, label: "Error" },
]

export const logType2IconMap: Partial<Record<LogType, string>> = {
  [LogType.ERROR]: "icon-error",
  [LogType.WARN]: "icon-warn",
  [LogType.INFO]: "icon-info",
}

/** 需要展示总数的日志类型列表 */
export const countLogTypeList: LogType[] = [
  LogType.ERROR,
  LogType.WARN,
  LogType.INFO,
]

export const logType2CountMap = reactive(countLogTypeList.reduce((acc, logType) => {
  acc[logType] = 0
  return acc
}, {} as Record<LogType, number>))