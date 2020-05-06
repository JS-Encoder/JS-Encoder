/* eslint-disable */
import * as createTags from './createTags'

async function sendCodeToIframe (iframe, code, link, cdn, isMD) {
  const document = iframe.contentWindow.document
  const HTMLCode = code.HTMLCode
  const CSSCode = code.CSSCode
  const JSCode = code.JSCode
  // iframe元素可以获取，但是内部元素(body)可能还没有加载完成，因此要等待iframe加载完成再进行下面的操作
  document.body.innerHTML = HTMLCode
  function insertCssCode () {
    // 判断iframe中是否存在用于存放用户编写css的style标签，将其删除再引入
    const runnerStyle = document.getElementById('JSEncoderRunnerCSS')
    if (runnerStyle) runnerStyle.parentNode.removeChild(runnerStyle)
    !isMD && createTags.createStyleOrScript(iframe, 'style', 'JSEncoderRunnerCSS', CSSCode)
  }
  // 在iframe中创建link外部链接
  if (link.length) {
    for (let i = 0, k = link.length;i < k;i++) {
      if (i === k - 1) {
        createTags.createLinkOrCDN(iframe, 'link', link[i], function () {
          insertCssCode()
        })
      } else {
        createTags.createLinkOrCDN(iframe, 'link', link[i])
      }
    }
  } else {
    insertCssCode()
  }
  function insertJsCode () {
    // 判断iframe中是否存在用于存放用户编写js的script标签，将其删除再引入
    const runnerScript = document.getElementById('JSEncoderRunnerJS')
    if (runnerScript) runnerScript.parentNode.removeChild(runnerScript)
    !isMD && createTags.createStyleOrScript(iframe, 'script', 'JSEncoderRunnerJS', JSCode)
  }
  // 在iframe中创建外部cdn
  if (cdn.length) {
    for (let i = 0, k = cdn.length;i < k;i++) {
      if (i === k - 1) {
        createTags.createLinkOrCDN(iframe, 'script', cdn[i], function () {
          insertJsCode()
        })
      } else {
        createTags.createLinkOrCDN(iframe, 'script', cdn[i])
      }
    }
  } else {
    insertJsCode()
  }
}

function refresh (iframe) {
  iframe.contentWindow.location.reload(true)
}

export default {
  sendCodeToIframe,
  refresh
}