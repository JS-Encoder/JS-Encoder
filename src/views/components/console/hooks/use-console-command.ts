import { cursorLineDown, cursorLineUp, insertNewlineAndIndent } from "@codemirror/commands"
import { Prec } from "@codemirror/state"
import { keymap } from "@codemirror/view"
import { useCommonStore } from "@store/common"
import { AnyFunction } from "@type/interface"
import { Prep } from "@type/prep"
import { getPrepBaseExtension } from "@utils/editor/config/editor.config"
import { CodemirrorBase } from "@utils/editor/utils/codemirror-base"
import { ICodemirrorEditorSettings } from "@views/components/editor/editor"
import { computed, nextTick, ref } from "vue"

// eslint-disable-next-line max-lines-per-function
const useConsoleCommand = (options: {
  executeCommand: AnyFunction
}) => {
  const { executeCommand } = options
  /** console命令 */
  const command = ref<string>("")
  /** 历史命令列表 */
  const historyCommands: string[] = []
  /** 当前展示历史下标 */
  let currCommandIndex: number = 0

  /** shift + enter换行, enter执行 */
  const getExecuteKeymap = () => {
    return Prec.highest(keymap.of([
      { key: "Shift-Enter", run: insertNewlineAndIndent },
      {
        key: "Enter",
        run: () => {
          executeCommand()
          historyCommands.push(command.value)
          currCommandIndex = historyCommands.length
          command.value = ""
          return true
        },
      },
    ]))
  }

  /** 切换历史命令 */
  const getSwitchHistoryKeymap = () => {
    return Prec.highest(keymap.of([
      {
        key: "ArrowUp",
        preventDefault: true,
        run: (view) => {
          const baseTools = new CodemirrorBase(view)
          const currLine = baseTools.getCursor().line
          /** 在第一行按上方向键切换回上一个历史命令 */
          if (currLine === 1 && currCommandIndex) {
            currCommandIndex --
            command.value = historyCommands[currCommandIndex] || ""
            nextTick(() => {
              baseTools.setCursorByOffset(command.value.length)
            })
          } else {
            cursorLineUp(view)
          }
          return true
        },
      },
      {
        key: "ArrowDown",
        preventDefault: true,
        run: (view) => {
          const baseTools = new CodemirrorBase(view)
          const currLine = baseTools.getCursor().line
          const lastLine = baseTools.getLastLine().number
          /** 在最后一行按下方向键切换回下一个历史命令 */
          if (currLine === lastLine && currCommandIndex < historyCommands.length) {
            currCommandIndex ++
            command.value = historyCommands[currCommandIndex] || ""
            nextTick(() => {
              baseTools.setCursorByOffset(command.value.length)
            })
          } else {
            cursorLineDown(view)
          }
          return true
        },
      },
    ]))
  }

  /** 指令编辑器用codemirror，需要指定扩展 */
  const commandEditorExtensions = [
    getPrepBaseExtension(Prep.JAVASCRIPT),
    getExecuteKeymap(),
    getSwitchHistoryKeymap(),
  ]

  const commandEditorSettings = computed<ICodemirrorEditorSettings>(() => {
    const { theme } = useCommonStore()
    return {
      lineNumbers: false,
      lineWrapping: true,
      style: {
        ".cm-scroller": {
          fontSize: "12px",
          fontFamily: "JetBrains Mono",
        },
        ".cm-scroller .cm-line": {
          paddingLeft: "4px",
        },
        ".cm-scroller .cm-content": {
          padding: 0,
        },
        "&.cm-focused": {
          outline: "none",
        },
      },
      theme,
    }
  })

  return {
    command,
    commandEditorExtensions,
    commandEditorSettings,
  }
}

export default useConsoleCommand