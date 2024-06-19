import { ITemplateBase } from "@type/template"
import { safeJSONParse } from "@utils/tools/common"
import { unzipString, zipString } from "@utils/tools/string"

const useInstanceLink = () => {

  /** 将路由中的config参数解压缩，解码 */
  const getInstanceConfig = (data: string = ""): ITemplateBase | null => {
    if (!data) { return null }
    const configStr = parseInstanceConfig(data)
    return safeJSONParse(configStr, null)
  }

  /** 字符串解压缩，解码 */
  const parseInstanceConfig = (data: string = ""): string => {
    return unzipString(window.atob(decodeURIComponent(data)))
  }

  /** 将字符串压缩，编码 */
  const stringifyInstanceConfig = (config: ITemplateBase) => {
    return encodeURIComponent(window.btoa(zipString(JSON.stringify(config))))
  }

  return {
    getInstanceConfig,
    parseInstanceConfig,
    stringifyInstanceConfig,
  }
}

export default useInstanceLink