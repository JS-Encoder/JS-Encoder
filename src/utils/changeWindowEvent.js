window.onbeforeunload = function (e) {
  let dialogText = 'Dialog text here'
  e.returnValue = dialogText
  return dialogText
}
window.isCloseHint = true
window.addEventListener('beforeunload', function (e) {
  if (window.isCloseHint) {
    let confirmationMessage = '要记得保存！你确定要离开我吗？';
    (e || window.event).returnValue = confirmationMessage
    return confirmationMessage
  }
})
