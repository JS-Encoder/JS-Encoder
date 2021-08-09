/**
 * Handling shortcut keys
 * 处理快捷键
 */

const shortcut = {
  all_shortcuts: {},
  add (shortcut_combination, callback, filed, opt) {
    /**
     * Default shortcut key configuration
     * 默认快捷键配置
     */
    const default_options = {
      type: 'keydown',
      propagate: false,
      disable_in_input: false,
      target: document,
      keycode: false
    }
    if (!opt) opt = default_options
    else {
      for (let dfo in default_options) {
        if (typeof opt[dfo] == 'undefined') opt[dfo] = default_options[dfo]
      }
    }

    let ele = opt.target
    if (typeof opt.target == 'string') ele = document.getElementById(opt.target)
    shortcut_combination = shortcut_combination.toLowerCase()

    /**
     * Press the button to trigger the method
     * 按键按下触发该方法
     * @param {Event} e 
     */
    const func = function (e) {
      e = e || window.event

      /**
       * Shortcuts do not fire when the focus is on input, Textarea
       * 焦点在input，textarea中时不会触发快捷键
       */
      if (opt['disable_in_input']) {
        let element
        if (e.target) element = e.target
        else if (e.srcElement) element = e.srcElement
        if (element.nodeType == 3) element = element.parentNode
        if (element.tagName == 'INPUT' || element.tagName == 'TEXTAREA') return
      }

      /**
       * Find out which key was pressed
       * 找到哪个键被按下
       */
      let code
      if (e.keyCode) code = e.keyCode
      else if (e.which) code = e.which
      let character = String.fromCharCode(code).toLowerCase()

      if (code == 188) character = ","
      if (code == 190) character = "."

      const keys = shortcut_combination.split("+")
      let kp = 0

      /**
       * The uppercase character that corresponds to shift when the user presses down
       * 用户按下shift时其对应的大写字符
       */
      const shift_nums = {
        "`": "~",
        "1": "!",
        "2": "@",
        "3": "#",
        "4": "$",
        "5": "%",
        "6": "^",
        "7": "&",
        "8": "*",
        "9": "(",
        "0": ")",
        "-": "_",
        "=": "+",
        "": ":",
        "'": "\"",
        ",": "<",
        ".": ">",
        "/": "?",
        "\\": "|"
      }

      /**
       * ASCII code table for some specific characters
       * 一些特定字符ASCII码表
       */
      const special_keys = {
        'esc': 27,
        'escape': 27,
        'tab': 9,
        'space': 32,
        'return': 13,
        'enter': 13,
        'backspace': 8,

        'scrolllock': 145,
        'scroll_lock': 145,
        'scroll': 145,
        'capslock': 20,
        'caps_lock': 20,
        'caps': 20,
        'numlock': 144,
        'num_lock': 144,
        'num': 144,

        'pause': 19,
        'break': 19,

        'insert': 45,
        'home': 36,
        'delete': 46,
        'end': 35,

        'pageup': 33,
        'page_up': 33,
        'pu': 33,

        'pagedown': 34,
        'page_down': 34,
        'pd': 34,

        'left': 37,
        'up': 38,
        'right': 39,
        'down': 40,

        'f1': 112,
        'f2': 113,
        'f3': 114,
        'f4': 115,
        'f5': 116,
        'f6': 117,
        'f7': 118,
        'f8': 119,
        'f9': 120,
        'f10': 121,
        'f11': 122,
        'f12': 123
      }

      const modifiers = {
        shift: { wanted: false, pressed: false },
        ctrl: { wanted: false, pressed: false },
        alt: { wanted: false, pressed: false },
        meta: { wanted: false, pressed: false }	// Meta是mac端的(即windows的alt键)
      }

      if (e.ctrlKey) modifiers.ctrl.pressed = true
      if (e.shiftKey) modifiers.shift.pressed = true
      if (e.altKey) modifiers.alt.pressed = true
      if (e.metaKey) modifiers.meta.pressed = true
      let k
      for (let i = 0;k = keys[i], i < keys.length;i++) {
        if (k == 'ctrl' || k == 'control') {
          kp++
          modifiers.ctrl.wanted = true
        } else if (k == 'shift') {
          kp++
          modifiers.shift.wanted = true
        } else if (k == 'alt') {
          kp++
          modifiers.alt.wanted = true
        } else if (k == 'meta') {
          kp++
          modifiers.meta.wanted = true
        } else if (k.length > 1) {
          if (special_keys[k] == code) kp++

        } else if (opt['keycode']) {
          if (opt['keycode'] == code) kp++

        } else {
          if (character == k) kp++
          else {
            if (shift_nums[character] && e.shiftKey) {
              character = shift_nums[character]
              if (character == k) kp++
            }
          }
        }
      }

      if (kp == keys.length &&
        modifiers.ctrl.pressed == modifiers.ctrl.wanted &&
        modifiers.shift.pressed == modifiers.shift.wanted &&
        modifiers.alt.pressed == modifiers.alt.wanted &&
        modifiers.meta.pressed == modifiers.meta.wanted) {
        /**
         * Execute the callback function within the given scope
         * because the current this points to window by default, and the callback function needs to operate on vueX
         * 在给定范围内执行该回调函数，因为当前的this默认指向window，而回调函数中需要对vueX进行操作
         */
        callback.bind(filed)(e)

        if (!opt['propagate']) {
          /**
           * e.cancelBubble is compatible with ie, event bubbling is prohibited
           * e.cancelBubble 兼容ie，禁止事件冒泡
           */
          e.cancelBubble = true
          e.returnValue = false
          /**
           * e.stopPropagation is compatible with Firefox
           * e.stopPropagation 兼容火狐
           */
          if (e.stopPropagation) {
            e.stopPropagation()
            e.preventDefault()
          }
          return false
        }
      }
    }
    this.all_shortcuts[shortcut_combination] = {
      'callback': func,
      'target': ele,
      'event': opt['type']
    }
    if (ele.addEventListener) ele.addEventListener(opt['type'], func, false)
    else if (ele.attachEvent) ele.attachEvent('on' + opt['type'], func)
    else ele['on' + opt['type']] = func
  },
  /**
   * Delete the shortcut key (unbind the shortcut key event)
   * 删除快捷键（解绑快捷键事件）
   * @param {Function} shortcut_combination 
   */
  remove (shortcut_combination) {
    shortcut_combination = shortcut_combination.toLowerCase()
    const binding = this.all_shortcuts[shortcut_combination]
    delete (this.all_shortcuts[shortcut_combination])
    if (!binding) return
    const type = binding['event']
    const ele = binding['target']
    const callback = binding['callback']

    if (ele.detachEvent) ele.detachEvent('on' + type, callback)
    else if (ele.removeEventListener) ele.removeEventListener(type, callback, false)
    else ele['on' + type] = false
  }
}

export default shortcut