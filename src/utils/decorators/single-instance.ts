/**
 * 用于给类加上单例模式的装饰器
 * @param targetConstructor
 * @constructor
 */
export default function SingleInstance<T extends new (...args: any[]) => {}>(targetConstructor: T) {
  return class extends targetConstructor {
    constructor(...args: any[]) {
      const prototype = targetConstructor.prototype
      if (!prototype.$instance) {
        super(...args)
        prototype.$instance = this
      }
      return prototype.$instance
    }
  }
}