/* eslint-disable */
function createStyleOrScript(iframe, element, id, code) {
  const document = iframe.contentWindow.document
  const ele = document.createElement(element)
  ele.id = id
  if (element === 'style') {
    ele.innerText = code
    document.head.appendChild(ele)
  } else if (element === 'script') {
    ele.text = code
    document.body.appendChild(ele)
  }
}

function createLinkOrCDN(iframe, element, url) {
  const document = iframe.contentWindow.document
  const ele = document.createElement(element)
  if (element === 'link') {
    ele.href = url
    ele.rel = 'stylesheet'
    document.head.appendChild(ele)
  } else if (element === 'script') {
    ele.src = url
    document.body.appendChild(ele)
  }
}

export {
  createStyleOrScript,
  createLinkOrCDN
}