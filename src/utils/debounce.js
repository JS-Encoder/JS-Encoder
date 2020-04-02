export function debounce (fn, wait) {
  let timeout = null
  wait = wait || 600
  return function () {
    let that = this
    if (timeout !== null) clearTimeout(timeout)
    timeout = setTimeout(() => {
      fn.apply(that)
    }, wait)
  }
}
