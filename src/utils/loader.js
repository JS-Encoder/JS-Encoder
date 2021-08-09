/**
 * Cache module to prevent the same module from being introduced multiple times
 * 缓存模块，防止多次引入相同模块
 */

class Loader {
  constructor() {
    this.map = {}
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
  has(k){
    return this.map.hasOwnProperty()
  }
  get (k) {
    return this.map[k]
  }
}
export default Loader