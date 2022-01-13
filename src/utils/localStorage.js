function set (key, val) {
  localStorage.setItem(key, JSON.stringify(val))
}

function get (key) {
  const val = localStorage.getItem(key)
  if (val === undefined) {
    return undefined
  } else {
    return JSON.parse(val)
  }
}

export default {
  set,
  get
}