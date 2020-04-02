import * as zh from '../common/lang/zh'
import * as en from '../common/lang/en'

const global = {
  language: en
}

function webLocation() {
  // 判断客户端语言
  const language = navigator.language
  if (language === 'zh-CN') global.language = zh
}

webLocation()

export default global