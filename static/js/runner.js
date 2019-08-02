
var consoleInfo = []
// 重写window.error
window.onerror = function (msg, url, row, col) {
  consoleInfo.push({ data: { msg, url, row, col }, type: 'error' })
  return true
}
// 重写console
if (console) {
  var ableMethods = ['log', 'info', 'debug', 'warn', 'error']
  for (let item of ableMethods) {
    console[item] = function (data) {
      consoleInfo.push({ data, type: item })
    }
  }
}
// 重写document.write
document.write = function (data) {
  document.body.innerHTML += data
}
