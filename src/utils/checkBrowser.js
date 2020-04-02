/**
 * 检测浏览器类型及版本
 * @return String type
 * @return String version
 */
function judgeBrowserTAndV () {
  const ua = navigator.userAgent.toLowerCase()
  let type = '', version = ''
  if (isIE()) {
    type = 'ie'
    version = ua.match(/msie ([\d.]+)/)[1]
  } else if (isOpera()) {
    type = 'opera'
    version = ua.match(/opera.([\d.]+)/)[1]
  } else if (isFireFox()) {
    type = 'firefox'
    version = ua.match(/firefox\/([\d.]+)/)[1]
  } else if (isEdge()) {
    type = 'edge'
    version = ua.match(/edge\/([\d.]+)/)[1]
  } else if (isSafari()) {
    type = 'safari'
    version = ua.match(/version\/([\d.]+)/)[1]
  } else if (isChrome()) {
    type = 'chrome'
    version = ua.match(/chrome\/([\d.]+)/)[1]
  }

  return {
    type,
    version
  }
}

function isIE () {
  return !!(window.ActiveXObject || "ActiveXObject" in window)
}

function isOpera () {
  return !!window.opera
}

function isFireFox () {
  return !!document.getBoxObjectFor
}

function isEdge () {
  return !!(navigator.userAgent.indexOf("Edge") > -1)
}

function isSafari () {
  return !!(/Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent))
}

function isChrome () {
  return !!(window.MessageEvent && !document.getBoxObjectFor)
}

export default judgeBrowserTAndV