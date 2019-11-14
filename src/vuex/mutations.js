import * as judge from '../utils/judgeMode'

export default {
  change: (state, obj) => {
    for (let key in obj) {
      state.textBoxContent[key] = obj[key]
    }
  },
  updateTextBoxW: (state, info) => {
    const attr = judge.judgeMode(info.attr)
    state.textBoxW[attr] = info.value
  },
  updateStateAttr: (state, info) => {
    state[info.attr] = info.value
  },
  updateOutput: (state, newVal) => {
    state.textBoxContent.Output = newVal
  },
  updateConsole: (state, newVal) => {
    state.consoleInfo = newVal
  },
  updateScreen: (state, newVal) => {
    state.showScreen = newVal
  },
  updateTime: (state, newVal) => {
    state.waitTime = newVal
  },
  updateReplace: (state, newVal) => {
    state.replace = newVal
  },
  updateAutoUp: (state, newVal) => {
    state.autoUp = newVal
  },
  updateRun: (state, newVal) => {
    state.isRun = newVal
  },
  updateCDN: (state, newVal) => {
    state.cdnJs = newVal
  },
  updateCssLinks: (state, newVal) => {
    state.cssLinks = newVal
  },
  updateAccountInfo: (state, obj) => {
    for (let attr in obj) {
      state.accountInfo[attr] = obj[attr]
    }
  },
  updateClientInfo: (state, info) => {
    state.clientInfo = info
  },
  updateLoginStatus: (state, newVal) => {
    state.loginStatus = newVal
  }
}
