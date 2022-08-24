/**
 * Set of regular expressions to be used
 * 使用到的正则表达式集合
 */

module.exports = {
  // 文件名,长度不超过255且不包括特殊字符\/<>|?:*
  filename: /^((?!\\|\/|:|\*|\?|<|>|\|).){1,255}$/
}
