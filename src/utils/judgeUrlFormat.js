/* eslint-disable */
function judgeFormat(arr, fn) {
  if (!arr.length) return
  for (let item of arr) {
    if (!item) continue
    if (item.indexOf('https://') != -1 || item.indexOf('http://') != -1)
      fn(item)
  }
}
export default judgeFormat