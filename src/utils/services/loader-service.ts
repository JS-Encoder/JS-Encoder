import SingleInstance from "@utils/decorators/single-instance"
import { safeFetch } from "@utils/tools/request"

/** 模块类型 */
export enum ModuleType {
  /** 使用require方式引入 */
  COMMON_JS = "commonJS",
  /** 使用import方式引入 */
  ES_MODULE = "esModule",
}

/** 缓存模块，防止多次引入相同模块 */
@SingleInstance
class LoaderService {
  /** 缓存模块的映射 */
  private map: Record<string, any> = {}
  constructor() {
    this.map = {}
  }
  /** 加载模块 */
  async loadModule<T>(
    key: string,
    /** 获取模块内容的方法，需要返回一个promise */
    getModuleFunc: () => Promise<T>,
  ) {
    let module
    if (!this.get(key)) {
      module = await getModuleFunc()
      this.set(key, module)
    } else {
      module = this.get(key)
    }
    return module as T
  }
  /** 加载script脚本，监听加载完成 */
  async loadScript(url: string, module: boolean = false): Promise<void> {
    const head = document.getElementsByTagName("head")[0]
    const script = document.createElement("script")
    script.type = module ? "module" : "text/javascript"
    script.src = url
    head.appendChild(script)
    return new Promise((resolve) => {
      script.onload = () => resolve()
    })
  }
  /** 请求url获取内容 */
  async loadUrl(url: string): Promise<string> {
    let text = ""
    await safeFetch(url)
      .then(async (res) => res.blob())
      .then((res) => res.text())
      .then((res) => {
        text = res
      })
    return text
  }
  set(key: string, value: any): void {
    this.map[key] = value
  }
  has(key: string): boolean {
    return this.map.hasOwnProperty(key)
  }
  get(key: string): any {
    return this.map[key]
  }
}

export default LoaderService