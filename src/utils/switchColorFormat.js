/* eslint-disable */
function switchRGB(color) {
  if (!color) return
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color)
  return {
    r: parseInt(result[1], 16) + '',
    g: parseInt(result[2], 16) + '',
    b: parseInt(result[3], 16) + ''
  }
}

function switchHEX(color) {
  if (!(color.r && color.g && color.b)) return
  const r = parseInt(color.r)
  const g = parseInt(color.g)
  const b = parseInt(color.b)
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}

export {
  switchRGB,
  switchHEX
}