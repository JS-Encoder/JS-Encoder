/* eslint-disable */
import * as createTags from './createTags'

class LoadFiles {
  constructor() {
    this.map = {}
  }
  set (k, v) {
    this.map[k] = v
  }
  get (k) {
    return this.map[k]
  }
}
const loadFiles = new LoadFiles()

async function sendCodeToIframe (iframe, code, link, cdn, isMD) {
  const contentWindow = iframe.contentWindow
  const document = contentWindow.document
  let { HTMLCode, CSSCode, JSCode } = code
  // iframe元素可以获取，但是内部元素(body)可能还没有加载完成，因此要等待iframe加载完成再进行下面的操作
  document.body.innerHTML = HTMLCode
  // 在iframe中创建link外部链接
  if (link.length) {
    for (let i = 0, k = link.length;i < k;i++) {
      if (i === k - 1) {
        createTags.createLinkOrCDN(iframe, 'link', link[i], function () {
          !isMD && insertCssCode()
        })
      } else {
        createTags.createLinkOrCDN(iframe, 'link', link[i])
      }
    }
  } else {
    insertCssCode()
  }
  if (cdn.length) {
    for (let i = 0, k = cdn.length;i < k;i++) {
      if (i === k - 1) {
        createTags.createLinkOrCDN(iframe, 'script', cdn[i], async () => {
          !isMD && insertJsCode()
          handleMarkdown(iframe)
        })
      } else {
        createTags.createLinkOrCDN(iframe, 'script', cdn[i])
      }
    }
  } else {
    insertJsCode()
  }

  function insertCssCode () {
    // 判断iframe中是否存在用于存放用户编写css的style标签，将其删除再引入
    const runnerStyle = document.getElementById('JSEncoderRunnerCSS')
    if (runnerStyle) runnerStyle.parentNode.removeChild(runnerStyle)
    createTags.createStyleOrScript(iframe, 'style', 'JSEncoderRunnerCSS', CSSCode)
  }

  function insertJsCode () {
    // 判断iframe中是否存在用于存放用户编写js的script标签，将其删除再引入
    const runnerScript = document.getElementById('JSEncoderRunnerJS')
    if (runnerScript) runnerScript.parentNode.removeChild(runnerScript)
    createTags.createStyleOrScript(iframe, 'script', 'JSEncoderRunnerJS', JSCode)
  }
}

function handleMarkdown (iframe) {
  const contentWindow = iframe.contentWindow
  const document = contentWindow.document
  const Hub = contentWindow.MathJax.Hub
  Hub.Config({
    showProcessingMessages: false, //关闭js加载过程信息
    messageStyle: "none", //不显示信息
    jax: ["input/TeX", "output/HTML-CSS"],
    tex2jax: {
      inlineMath: [["$", "$"], ["\\(", "\\)"]], //行内公式选择符
      displayMath: [["$$", "$$"], ["\\[", "\\]"]], //段内公式选择符
      skipTags: ["script", "noscript", "style", "textarea", "pre", "code", "a"] //避开某些标签
    },
    "HTML-CSS": {
      availableFonts: ["STIX", "TeX"], //可选字体
      showMathMenu: false //关闭右击菜单显示
    }
  })
  Hub.Queue(["Typeset", Hub])
  // 流程图
  const flows = document.querySelectorAll('.language-flow')
  for (let i = 0, k = flows.length;i < k;i++) {
    const flow = flows[i]
    const pre = flow.parentNode
    const chart = contentWindow.flowchart.parse(flow.innerText)
    const chartBox = document.createElement('div')
    pre.parentNode.replaceChild(chartBox, pre)
    chartBox.id = `flow${i}`
    chartBox.className='flowchart'
    chart.drawSVG(`flow${i}`)
  }
  handleTitle(document)
  handleCheckbox(document)
}

function handleTitle (doc) {
  const titleList = []
  for (let i = 1;i <= 6;i++) {
    const level = i
    const list = doc.querySelectorAll(`h${i}`)
    list.forEach(ele => {
      titleList.push({
        ele,
        level
      })
    })
  }
  for (let i = 0, k = titleList.length;i < k;i++) {
    const title = titleList[i]
    const { ele, level } = title
    // 插入锚点
    const id = `${level}_${i}`
    ele.id = id
    const link = doc.createElement('a')
    link.href = `#${id}`
    link.className="icon iconfont icon-insertlink"
    link.style.textDecoration = 'none'
    link.style.lineHeight='100%'
    link.style.paddingLeft='5px'
    ele.appendChild(link)
  }
}

function handleCheckbox(doc){
  const checkboxList = doc.querySelectorAll('input[type="checkbox"]')
  for (let i = 0, k = checkboxList.length;i < k;i++) {
    const checkbox = checkboxList[i]
    checkbox.parentNode.style.listStyle = 'none'
  }
}


/**
 * 请求外部js文件获取内容
 * @param Array urlList cdn链接列表
 */
async function loadUrl (urlList) {
  const promises = []
  let code = ''
  urlList.forEach(url => {
    if (!loadFiles.get(url)) { // 没有请求过该文件
      const promise = fetch(url)
        .then(res => res.text())
        .then(data => {
          loadFiles.set(url, data)
          return data
        })
      promises.push(promise)
    } else {// 请求过该文件
      code += `${loadFiles.get(url)}`
    }
  })
  if (promises.length) {
    await Promise.all(promises).then(list => {
      for (let i = 0;i < list.length;i++) {
        code += `${list[i]}`
      }
    })
  }
  return code
}

function refresh (iframe) {
  iframe.contentWindow.location.reload(true)
}

export default {
  sendCodeToIframe,
  refresh
}