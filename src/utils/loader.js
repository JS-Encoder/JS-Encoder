/**
 * Cache module to prevent the same module from being introduced multiple times
 * 缓存模块，防止多次引入相同模块
 */

class Loader {
  constructor() {
    if (!Loader.instance) {
      Loader.instance = this
      this.map = {}
    }
    return Loader.instance
  }
  async loadScript (url) {
    const head = document.getElementsByTagName('head')[0]
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = url
    head.appendChild(script)
    return new Promise((resolve, reject) => {
      script.onload = () => {
        resolve()
      }
    })
  }
  async loadUrl (url) {
    let text = ''
    await fetch(url)
      .then(async res => res.blob())
      .then(res => res.text())
      .then(res => {
        text = res
      })
    return text
  }
  set (k, v) {
    this.map[k] = v
  }
  has (k) {
    return this.map.hasOwnProperty(k)
  }
  get (k) {
    return this.map[k]
  }
}
export default Loader