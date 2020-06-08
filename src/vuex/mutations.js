/**
 * VueX mutations
 */
export default {
  updateUserInfo: (state, newInfo) => {
    state.userInfo = newInfo
  },
  updateLang: (state, lang) => {
    if (state.language !== lang) state.language = lang
  },
  updateSidebarStatus: (state, status) => {
    state.sidebarStatus = status
  },
  updateClientWidth: (state, newWidth) => {
    state.clientWidth = newWidth
  },
  updateCodeAreaMessage: (state, newMessage) => {
    state.codeAreaContent[newMessage.mode] = newMessage.message
  },
  updateCodeAreaAllMessage: (state, newCode) => {
    state.codeAreaContent = newCode
  },
  updateProjectTags: (state, newTags) => {
    state.tags = newTags
  },
  updateProjectId: (state, newId) => {
    state.projectId = newId
  },
  updateProjectName: (state, newName) => {
    state.projectName = newName
  },
  updatePosterKey: (state, newKey) => {
    state.posterKey = newKey
  },
  updateCurrentDialog: (state, newCurrent) => {
    state.currentDialog = newCurrent
  },
  updateCurrentSecOpt: (state, newCurrent) => {
    state.currentSecOpt = newCurrent
  },
  updateCurrentTab: (state, newCurrent) => {
    state.currentTab = newCurrent
  },
  updateConsoleSize: (state, size) => {
    state.consoleSize = Number.parseFloat(size)
  },
  updateCodeAreaHeight: (state, size) => {
    state.codeAreaHeight = Number.parseFloat(size)
  },
  updateCodeAreaWidth: (state, size) => {
    state.codeAreaWidth = Number.parseFloat(size)
  },
  updateIframeWidth: (state, size) => {
    state.iframeWidth = Number.parseFloat(size)
  },
  updateShowBg: (state, status) => {
    state.showBg = status
  },
  updateShowSlideUserMenu: (state, status) => {
    state.showSlideUserMenu = status
  },
  updateShowSaveBtn: (state, status) => {
    state.showSaveBtn = status
  },
  updateShowSaveTip: (state, status) => {
    state.showSaveTip = status
  },
  updateLoginStatus: (state, status) => {
    state.loginStatus = status
  },
  updatePreprocess: (state, obj) => {
    state.preprocess.splice(obj.index, 1, obj.newPrep)
  },
  updateAllPreprocess: (state, newPrepList) => {
    state.preprocess = newPrepList
  },
  updateCodeOptions: (state, newOptions) => {
    state.codeOptions[newOptions.option] = newOptions.conf
  },
  updateCdnJS: (state, newCDNList) => {
    state.CDNList = newCDNList
  },
  updateLinkList: (state, newLinkList) => {
    state.linkList = newLinkList
  },
  updateIsProjectExist: (state, newStatus) => {
    state.isProjectExist = newStatus
  },
  updateIframeScreen: (state, newStatus) => {
    state.iframeScreen = newStatus
  },
  updateShowIframeHeight: (state, newStatus) => {
    state.showIframeHeight = newStatus
  },
  updateShowIframeWidth: (state, newStatus) => {
    state.showIframeWidth = newStatus
  },
  updateConsoleInfo: (state, newInfo) => {
    state.consoleInfo = newInfo
  },
  updateIsFilterShow: (state, newStatus) => {
    state.isFilterShow = newStatus
  },
  updateFilterList: (state, newList) => {
    state.filterList = newList
  },
  updateShowPageLoader: (state, newStatus) => {
    state.showPageLoader = newStatus
  },
  cleanUserConfig: (state) => {
    // 用户登出时使用
    state.userInfo = {}
    state.loginStatus = false
  },
  cleanProjectConfig: (state) => {
    // 清除console
    state.isFilterShow = false
    state.filterList = ['log', 'info', 'warn', 'error']
    state.consoleInfo = []
    // 存储
    state.showSaveBtn = false
    state.showSaveTip = false
    // 清除项目详情
    state.linkList = []
    state.CDNList = []
    state.codeAreaContent = { HTML: '', CSS: '', JavaScript: '' }
    state.preprocess = ['HTML', 'CSS', 'JavaScript']
    state.posterKey = ''
    state.projectName = ''
    state.projectId = ''
    state.currentTab = 'HTML'
    state.codeOptions = {
      replace: true,
      autoUp: true,
      waitTime: 1000,
      showHistoryLog: false,
      tabIndent: 2
    }
  }
}
