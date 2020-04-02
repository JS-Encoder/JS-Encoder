/* eslint-disable */
function switchRGB(color) {
  if (!color) return
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color)
  return {
    R: parseInt(result[1], 16) + '',
    G: parseInt(result[2], 16) + '',
    B: parseInt(result[3], 16) + ''
  }
}

function switchHEX(color) {
  if (!(color.R && color.G && color.B)) return
  const r = parseInt(color.R)
  const g = parseInt(color.G)
  const b = parseInt(color.B)
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}

export {
  switchRGB,
  switchHEX
}