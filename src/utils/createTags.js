/**
 * 在iframe创建style或script
 * @param Dom iframe 
 * @param Dom element 
 * @param string id 
 * @param string code 
 */
function createStyleOrScript (iframe, element, id, code) {
  const document = iframe.contentWindow.document
  const ele = document.createElement(element)
  ele.id = id
  if (element === 'style') {
    ele.type = 'text/css'
    ele.innerHTML = code
    document.head.appendChild(ele)
  } else if (element === 'script') {
    ele.text = code
    document.body.appendChild(ele)
  }
}
/**
 * 在iframe创建link或script
 * @param Dom iframe 
 * @param Dom element 
 * @param string url 
 * @param function callback 
 */
function createLinkOrCDN (iframe, element, url, callback) {
  const document = iframe.contentWindow.document
  const ele = document.createElement(element)
  let result = ''
  if (element === 'link') {
    ele.href = url
    ele.rel = 'stylesheet'
    ele.onload = callback
    document.head.appendChild(ele)
  } else if (element === 'script') {
    ele.src = url
    ele.onload = callback
    document.body.appendChild(ele)
  }
}

export {
  createStyleOrScript,
  createLinkOrCDN
}