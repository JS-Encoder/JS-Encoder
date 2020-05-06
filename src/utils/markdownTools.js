function changeTextStyle (cm, matchStr) {
  // 在前后加上matchStr
  const changePos = matchStr.length
  let preAlready = false,
    aftAlready = false // 前后是否已经有相应样式标识，如**，_，~等
  if (cm.somethingSelected()) {
    // 如果选中了文本
    const selectContent = cm.listSelections()[0] // 第一个选中的文本
    let { anchor, head } = judgePreOrAft(selectContent) // 前后光标位置
    let { line: preLine, ch: prePos } = head
    let { line: aftLine, ch: aftPos } = anchor
    // 判断前后是否有matchStr
    cm.getRange({ line: preLine, ch: prePos - changePos }, head) ===
      matchStr && (preAlready = true)
    cm.getRange(anchor, { line: aftLine, ch: aftPos + changePos }) ===
      matchStr && (aftAlready = true)
    // 去除前后的matchStr
    aftAlready &&
      cm.replaceRange('', anchor, { line: aftLine, ch: aftPos + changePos })
    preAlready &&
      cm.replaceRange('', { line: preLine, ch: prePos - changePos }, head)
    if (!preAlready && !aftAlready) {
      // 前后都没有matchStr
      cm.setCursor(anchor)
      cm.replaceSelection(matchStr)
      cm.setCursor(head)
      cm.replaceSelection(matchStr)
      prePos += changePos
      aftPos += aftLine === preLine ? changePos : 0
      cm.setSelection(
        { line: aftLine, ch: aftPos },
        { line: preLine, ch: prePos }
      )
    } else if (!preAlready) {
      // 只有后面有matchStr
      cm.setCursor(head)
      cm.replaceSelection(matchStr)
      prePos += changePos
      aftPos += aftLine === preLine ? changePos : 0
      cm.setSelection(
        { line: aftLine, ch: aftPos },
        { line: preLine, ch: prePos }
      )
    } else if (!aftAlready) {
      // 只有前面有matchStr
      cm.setCursor({ line: aftLine, ch: aftPos - changePos })
      cm.replaceSelection(matchStr)
      prePos -= changePos
      aftPos -= aftLine === preLine ? changePos : 0
      cm.setSelection(
        { line: aftLine, ch: aftPos },
        { line: preLine, ch: prePos }
      )
    }
    cm.focus()
  } else {
    const cursor = cm.getCursor()
    const { line: curLine, ch: curPos } = cursor // 获取光标位置
    // 判断前后是否有matchStr
    cm.getRange({ line: curLine, ch: curPos - changePos }, cursor) ===
      matchStr && (preAlready = true)
    cm.getRange(cursor, { line: curLine, ch: curPos + changePos }) ===
      matchStr && (aftAlready = true)
    // 去除前后的matchStr
    if (aftAlready && preAlready) {
      cm.replaceRange('', cursor, { line: curLine, ch: curPos + changePos })
      cm.replaceRange('', { line: curLine, ch: curPos - changePos }, cursor)
      cm.setCursor({ line: curLine, ch: curPos - changePos })
      cm.focus()
    } else if (!preAlready && !aftAlready) {
      // 前后都没有matchStr
      replaceSelAndFocus(
        cm,
        matchStr + matchStr,
        curLine,
        curPos + changePos
      )
    }
  }
}
function addOrderList (cm) {
  // 添加有序列表
  if (cm.somethingSelected()) {
    const selectContent = cm.listSelections()[0] // 第一个选中的文本
    let { anchor, head } = judgePreOrAft(selectContent)
    let preLine = head.line
    let aftLine = anchor.line
    if (preLine !== aftLine) {
      // 选中了多行，在每行前加上匹配字符
      let preNumber = 0
      let pos = 0
      for (let i = preLine;i <= aftLine;i++) {
        cm.setCursor({ line: i, ch: 0 })
        const replaceStr = `${++preNumber}. `
        cm.replaceSelection(replaceStr)
        if (i === aftLine) {
          pos += (replaceStr + cm.getLine(i)).length
        }
      }
      cm.setCursor({ line: aftLine, ch: pos })
      cm.focus()
    } else {
      const selectVal = cm.getSelection()
      let preStr = cm.getRange({ line: preLine, ch: 0 }, head)
      let preNumber = 0
      let preBlank = ''
      if (/^( |\t)+/.test(preStr)) {
        // 有序列表标识前也许会有空格或tab缩进
        preBlank = preStr.match(/^( |\t)+/)[0]
        preStr = preStr.trimLeft()
      }
      if (/^\d+(\.) /.test(preStr)) {
        // 是否以'数字. '开头，找出前面的数字
        preNumber = Number.parseInt(preStr.match(/^\d+/)[0])
      }
      let replaceStr = `\n${preBlank}${preNumber + 1}. ${selectVal}\n`
      replaceSelAndFocus(cm, replaceStr, preLine + 1, replaceStr.length)
    }
  } else {
    const cursor = cm.getCursor()
    let { line: curLine, ch: curPos } = cursor // 获取光标位置
    let preStr = cm.getRange({ line: curLine, ch: 0 }, cursor)
    let preNumber = 0
    let preBlank = ''
    if (/^( |\t)+/.test(preStr)) {
      // 有序列表标识前也许会有空格或tab缩进
      preBlank = preStr.match(/^( |\t)+/)[0]
      preStr = preStr.trimLeft()
    }
    if (/^\d+(\.) /.test(preStr)) {
      // 是否以'数字. '开头，找出前面的数字
      preNumber = Number.parseInt(preStr.match(/^\d+/)[0])
    }
    let replaceStr = `\n${preBlank}${preNumber + 1}. `
    replaceSelAndFocus(cm, replaceStr, curLine + 1, replaceStr.length - 1)
  }
}
function addList (cm, matchStr) {
  // 添加引用和无序列表
  if (cm.somethingSelected()) {
    const selectContent = cm.listSelections()[0] // 第一个选中的文本
    let { anchor, head } = judgePreOrAft(selectContent)
    let preLine = head.line
    let aftLine = anchor.line
    if (preLine !== aftLine) {
      // 选中了多行，在每行前加上匹配字符
      let pos = matchStr.length
      for (let i = preLine;i <= aftLine;i++) {
        cm.setCursor({ line: i, ch: 0 })
        cm.replaceSelection(matchStr)
        i === aftLine && (pos += cm.getLine(i).length)
      }
      cm.setCursor({ line: aftLine, ch: pos })
      cm.focus()
    } else {
      // 检测开头是否有匹配的字符串，有就将其删除
      const preStr = cm.getRange({ line: preLine, ch: 0 }, head)
      if (preStr === matchStr) {
        cm.replaceRange('', { line: preLine, ch: 0 }, head)
      } else {
        const selectVal = cm.getSelection()
        let replaceStr = `\n\n${matchStr}${selectVal}\n\n`
        replaceSelAndFocus(
          cm,
          replaceStr,
          preLine + 2,
          (matchStr + selectVal).length
        )
      }
    }
  } else {
    const cursor = cm.getCursor()
    let { line: curLine, ch: curPos } = cursor // 获取光标位置
    let preStr = cm.getRange({ line: curLine, ch: 0 }, cursor)
    let preBlank = ''
    if (/^( |\t)+/.test(preStr)) {
      // 有序列表标识前也许会有空格或tab缩进
      preBlank = preStr.match(/^( |\t)+/)[0]
    }
    curPos && (matchStr = `\n${preBlank}${matchStr}`) && ++curLine
    replaceSelAndFocus(cm, matchStr, curLine, matchStr.length - 1)
  }
}
function addLine (cm) {
  // 添加横线
  if (cm.somethingSelected()) {
    const selectContent = cm.listSelections()[0] // 第一个选中的文本
    let head = judgePreOrAft(selectContent).head
    let { line: preLine, ch: prePos } = head
    let replaceStr = '\n\n---\n'
    replaceSelAndFocus(cm, replaceStr, preLine, prePos)
  } else {
    const cursor = cm.getCursor()
    let { line: curLine, ch: curPos } = cursor // 获取光标位置
    let replaceStr = curPos ? '\n\n---\n\n' : '\n---\n\n'
    curLine += curPos ? 4 : 3
    replaceSelAndFocus(cm, replaceStr, curLine, 0)
  }
}
function addTitle (cm, level) {
  // level代表标题级别，包括H1,H2,H3,H4,H5,H6
  let preAppend = '#' // 标题前插
  for (let i = 0;i < level - 1;i++) {
    preAppend += '#'
  }
  preAppend += ' '
  if (cm.somethingSelected()) {
    // 如果选中了文本
    const selectContent = cm.listSelections()[0] // 第一个选中的文本
    const selectVal = cm.getSelection()
    let { anchor, head } = judgePreOrAft(selectContent) // 前后光标位置
    let { line: preLine, ch: prePos } = head
    let aftLine = anchor.line
    if (preLine !== aftLine) return
    if (!prePos) {
      // 如果选中了文字，并且起始位置为 0
      cm.setCursor({ line: preLine, ch: 0 })
      replaceSelAndFocus(cm, preAppend, preLine, 0)
      cm.setCursor({ line: preLine, ch: (preAppend + selectVal).length })
      cm.replaceSelection('\n')
    } else {
      // 选中了文字但起始不为0，判断前面是已经有标题了
      const curLineVal = cm.getLine(preLine)
      const matchStr = curLineVal.substr(0, prePos)
      if (/^(#*) $/.test(matchStr)) {
        // 如果前面是以多个#开头并以一个空格结尾
        cm.replaceRange('', { line: preLine, ch: 0 }, head)
      } else {
        // 起始不为0，且前面也不存在标题的标识
        cm.replaceSelection(`\n\n${preAppend}${selectVal}\n\n`)
      }
    }
  } else {
    const cursor = cm.getCursor()
    let { line: curLine, ch: curPos } = cursor // 获取光标位置
    const curLineVal = cm.getLine(curLine) // 当前行内容
    curPos && (preAppend = '\n\n' + preAppend)
    cm.setCursor({ line: curLine + 1, ch: 0 })
    cm.replaceSelection('\n')
    cm.setCursor(cursor)
    replaceSelAndFocus(cm, preAppend, curLine, curPos)
    curLine += curPos ? 3 : 1
    if (curPos === curLineVal.length) {
      curLine -= 1
      curPos = preAppend.length
    } else {
      curPos = 0
    }
    cm.setCursor({ line: curLine, ch: curPos })
    cm.focus()
  }
}
function addLink (cm, isPicture = false) {
  // 添加链接
  if (cm.somethingSelected()) {
    // 如果选中了文本
    const selectContent = cm.listSelections()[0] // 第一个选中的文本
    const selectVal = cm.getSelection()
    let { anchor, head } = judgePreOrAft(selectContent)
    let { line: preLine, ch: prePos } = head
    let aftLine = anchor.line
    if (preLine !== aftLine) return
    // 如果选中的是链接，放到()里，如果选中的是文字，放到[]里
    const isLinkStr = judgeUrl(selectVal)
    let replaceStr = isLinkStr ? `[](${selectVal})` : `[${selectVal}]()`
    prePos += isLinkStr ? 1 : selectVal.length + 3
    if (isPicture) {
      prePos += 1
      replaceStr = '!' + replaceStr
    }
    replaceSelAndFocus(cm, replaceStr, preLine, prePos)
  } else {
    const cursor = cm.getCursor()
    let { line: curLine, ch: curPos } = cursor // 获取光标位置
    let replaceStr = '[]()'
    curPos += 3
    isPicture && (replaceStr = '!' + replaceStr) && (curPos += 1)
    replaceSelAndFocus(cm, replaceStr, curLine, curPos)
  }
}
function replaceSelAndFocus (cm, text, curLine, curPos) {
  // 在光标前加上文本，重新设置光标位置并聚焦
  cm.replaceSelection(text)
  cm.setCursor({ line: curLine, ch: curPos })
  cm.focus()
}
function judgePreOrAft (selectContent) {
  // 选中文本时，光标要么在内容前，要么在内容后，需要判断前后位置
  let { anchor, head } = selectContent
  head.line >= anchor.line &&
    head.sticky === 'before' &&
    ([head, anchor] = [anchor, head])
  return { head, anchor }
}
function judgeUrl (url) {
  return /^http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/.test(url)
}

export default {
  addOrderList,
  addList,
  addLine,
  addTitle,
  addLink,
  changeTextStyle
}