import { isHttpUrl } from "@utils/tools/common"

/** 解析文档获取style标签中的内容 */
const getStyleContent = (doc: Document) => {
  const styleElements = doc.getElementsByTagName("style")
  const styleContents = Array
    .from(styleElements)
    .map(({ textContent = "" }) => textContent)
    .filter((content) => !!content)
  return styleContents.join("\n").trim()
}

/** 获取引入的css外部链接(http/https) */
const getStyleLinks = (doc: Document) => {
  const linkElements = doc.getElementsByTagName("link")
  return Array
    .from(linkElements)
    .map(({ href }) => href)
    .filter((url) => url && isHttpUrl(url))
}

/** 获取引入的javascript外部链接(http/https)和script标签中包含的内容 */
const getScriptLinksAndContent = (doc: Document) => {
  const scriptELements = doc.getElementsByTagName("script")
  const links: string[] = []
  let content = ""
  Array.from(scriptELements).forEach((scriptTag) => {
    const { textContent, src } = scriptTag
    if (src && isHttpUrl(src)) {
      links.push(src)
    } else if (textContent) {
      content += textContent
    } else {}
  })
  return { links, content: content.trim() }
}

/** 分割HTML文件，将HTML文件分解成HTML、CSS和JavaScript代码，并取出里面包含的外部链接(仅含head标签内的) */
export const splitHTML = (content: string) => {
  // 尽管DOMParser大部分情况下性能不佳，但HTML并不是一个有规律的语言，使用正则很难保证匹配不会出错
  const parser = new DOMParser()
  const doc = parser.parseFromString(content, "text/html")
  const styleContent = getStyleContent(doc)
  const styleLinks = getStyleLinks(doc)
  const { links: scriptLinks, content: scriptContent } = getScriptLinksAndContent(doc)
  const scriptELements = doc.getElementsByTagName("script")
  // body中有可能包含script标签，需要先获取script标签中的内容，再将body中的script标签删除以便获得不包含脚本的代码
  Array.from(scriptELements).forEach((scriptELement) => scriptELement.remove())
  const htmlContent = doc.body.innerHTML.trim() || ""
  return {
    styleLinks,
    styleContent,
    htmlContent,
    scriptLinks,
    scriptContent,
  }
}