import * as zh from '../common/lang/zh'
import * as en from '../common/lang/en'

const global = {
  language: en,
  publicUrl: publicUrl()
}

function webLocation () {
  // 判断客户端语言
  const language = navigator.language
  if (language === 'zh-CN') global.language = zh
}

function publicUrl () {
  // 跳转链接
  let url = process.env.NODE_ENV === 'production'
    ? 'https://www.lliiooiill.cn/JSEncoderEnhance/'
    : 'http://localhost:8080/'
  return url
}

webLocation()

export default global