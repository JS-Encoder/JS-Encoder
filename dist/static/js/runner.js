
var consoleInfo = []
window.onerror = function (msg, url, row, col) {
  consoleInfo.push({ data: { msg, url, row, col }, type: 'error' })
  return true
}
if (console) {
  var ableMethods = ['log', 'info', 'debug', 'warn', 'error']
  for (let item of ableMethods) {
    console[item] = function (data) {
      consoleInfo.push({ data, type: item })
    }
  }
}
document.write = function (data) {
  document.body.innerHTML += data
}
