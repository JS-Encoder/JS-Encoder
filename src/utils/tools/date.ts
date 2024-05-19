/** 小于10的数字补一个0, 支持0.0秒格式 */
export const timeNum = (num: number, second?: boolean): string => {
  if (num >= 10) {
    return Math.floor(num) === num && second ? `${num}.0` : `${num}`
  }
  return Math.floor(num) === num && second ? `0${num}.0` : `0${num}`
}

/**
 * 格式化时间文本为 固定格式
 *
 * @param date Date
 * @param format 格式 yyyy/yy/MM/dd/HH/mm/ss 默认 yyyy-MM-dd HH:mm:ss
 */
export const formatDateTime = (date: Date, format: string = "yyyy-MM-dd HH:mm:ss"): string => {
  if (String(date) === "Invalid Date") { return "" }
  const dateNum = {
    yyyy: date.getFullYear(),
    yy: String(date.getFullYear()).slice(2),
    MM: date.getMonth() + 1, // 月份
    dd: date.getDate(), // 日
    HH: date.getHours(), // 小时
    mm: date.getMinutes(), // 分
    ss: date.getSeconds(), // 秒
  }

  // return '(yyyy)|(yy)| ... '
  const regPattern = Reflect.ownKeys(dateNum)
    .reduce<string>((str: string, key: any, index: number, arr: any[]): string => {
      return str + key + (index === arr.length - 1 ? ")" : "|")
    }, "(")
  const reg = new RegExp(regPattern, "g")
  return format.replace(reg, (_, g1: keyof typeof dateNum) => {
    return timeNum(Number(dateNum[g1]))
  })
}