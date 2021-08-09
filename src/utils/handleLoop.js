const acorn = require('acorn')
import estraverse from 'estraverse'

/**
 * This function is used to prevent the infinite loop in the user code from causing the browser page to freeze
 * 该函数用于防止用户代码中的死循环导致浏览器页面卡死
 * @param {String} code 处理前的JS代码
 * @returns {String}
 */
function handleLoop (code) {
  let AST = null
  /**
   * Parse the code into AST
   * Prevent grammatical analysis errors caused by code grammatical errors, so directly return to the source code
   * 将代码解析成AST
   * 防止因为代码语法错误造成语法解析错误，直接返回源代码
   */
  try {
    AST = acorn.parse(code, {
      ecmaVersion: 2022,
      sourceType: 'script'
    })
  } catch (error) {
    console.log(error)
    return code
  }

  /**
   * Temporarily store the range of positions where the code needs to be inserted
   * 暂存需要插入代码的位置范围
   */
  const fragments = []
  /**
   * loopID is used to mark the loop
   * loopID 用于标记循环
   */
  let loopID = 1
  /**
   * Mark the code that needs to be inserted when looping
   * 标记循环时需要插入的代码
   */
  const insertCode = {
    setMonitor: 'window.JSE.InfiniteLoopController._loopMonitor(%d);',
    delMonitor: ';window.JSE.InfiniteLoopController._delLoop(%d);'
  }

  /**
   * Traverse the AST to find the loop position
   * 遍历AST，找出循环位置
   */
  estraverse.traverse(AST, {
    enter (node) {
      switch (node.type) {
        case 'WhileStatement':
        case 'DoWhileStatement':
        case 'ForStatement':
        case 'ForInStatement':
        case 'ForOfStatement':
          /**
           * Gets the head and tail of the loop body
           * 获取循环体的头和尾
           */
          let { start, end } = node.body
          start++
          let pre = insertCode.setMonitor.replace('%d', loopID)
          let aft = ''
          /**
           * If the body of the loop is not enveloped by {} and is indented, we need to manually add {}
           * 如果循环体没有被{}包裹，而是采用缩进的形式，需要手动添加{}
           */
          if (node.body.type !== 'BlockStatement') {
            pre = '{' + pre
            aft = '}'
            --start
          }
          fragments.push({ pos: start, str: pre })
          fragments.push({ pos: end, str: aft })
          fragments.push({ pos: node.end, str: insertCode.delMonitor.replace('%d', loopID) })
          ++loopID
          break
        default:
          break
      }
    }
  })

  /**
   * Insert code to corresponding position
   * 将代码插入到相应位置中
   */
  fragments.sort((a, b) => {
    return b.pos - a.pos
  }).forEach(fragment => {
    code = code.slice(0, fragment.pos) + fragment.str + code.slice(fragment.pos)
  })

  return code
}

export default handleLoop