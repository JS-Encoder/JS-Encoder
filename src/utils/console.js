/* eslint-disable */

function exeCode(code) {
  return `\ntry {\n` +
    `console.log('${code}')\n` +
    `var r = eval('${code}')\n` +
    `console.log({data: r, type: 'return'})\n` +
    `} catch(e) {\n` +
    `console.log({data: e, type: 'error'})\n` +
    `}\n`
}

export default exeCode