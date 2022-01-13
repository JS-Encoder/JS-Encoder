export default {
  handleLanguage: (state, lang) => {
    state.language = lang
  },
  handleDialogState: (state, dialogName) => {
    // Change the currently displayed dialog, the default value is ''
    state.visibleDialog = dialogName
  },
  handlePreprocessor: (state, obj) => {
    const { index, newPrep } = obj
    state.preprocessor.splice(index, 1, newPrep)
  },
  handleShouldResetCode: (state, bool) => {
    state.shouldResetCode = bool
  },
  handleAllPreprocessor: (state, arr) => {
    state.preprocessor = arr
  },
  handleCurrentTab: (state, tab) => {
    state.currentTab = tab
  },
  handleMdToolbarVisible: (state, visible) => {
    state.mdToolbarVisible = visible
  },
  handleInstanceCode: (state, content) => {
    state.instanceCode[content.mode] = content.code
  },
  handleAllInstancesCode: (state, codeObj) => {
    state.instanceCode = codeObj
  },
  handleInstanceSetting: (state, attr) => {
    state.instanceSetting[attr.name] = attr.value
  },
  handleAllInstanceSetting: (state, obj) => {
    state.instanceSetting = obj
  },
  handleInstanceExtLinks: (state, attr) => {
    state.instanceExtLinks[attr.name] = attr.list
  },
  handleAllInstanceExtLinks: (state, obj) => {
    state.instanceExtLinks = obj
  },
  handleIframeScreenVisible: (state, visible) => {
    state.iframeScreenVisible = visible
  },
  handleConsoleH: (state, height) => {
    state.consoleHeight = height
  },
  handleIframeH: (state, height) => {
    state.iframeHeight = height
  },
  handleEditorW: (state, width) => {
    state.editorWidth = width
  },
  handleIframeW: (state, width) => {
    state.iframeWidth = width
  },
  handleIframeHVisible: (state, visible) => {
    state.iframeHeightVisible = visible
  },
  handleIframeWVisible: (state, visible) => {
    state.iframeWidthVisible = visible
  },
  handleResolveHTML: (state, status) => {
    state.resolveHTML = status
  },
  handleConsoleSettings: (state, setting) => {
    state.consoleSettings = setting
  },
  handleConsoleInfo: (state, logs) => {
    state.consoleInfo = logs
  },
  handleConsoleInfoCount: (state, count) => {
    state.consoleInfoCount = count
  },
  handleHasUploadCode: (state, status) => {
    state.hasUploadCode = status
  }
}
