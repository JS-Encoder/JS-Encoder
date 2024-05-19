export interface IShortcutMap {
  /** 集合类型 */
  type: string
  keymap: Array<{
    /** 功能名称 */
    name: string
    /** 键位列表 */
    keys: string[]
  }>
}

export const ShortcutMapList: IShortcutMap[] = [
  {
    type: "编码",
    keymap: [
      { name: "缩进代码", keys: ["Tab"] },
      { name: "格式化代码", keys: ["Shift", "Alt", "F"] },
      { name: "行注释", keys: ["Ctrl / Cmd", "/"] },
      { name: "块注释", keys: ["Shift", "Alt", "A"] },
      { name: "选择当前行", keys: ["Ctrl / Cmd", "L"] },
      { name: "向上互换行", keys: ["Alt", "Up"] },
      { name: "向下互换行", keys: ["Alt", "Down"] },
      { name: "向上复制行", keys: ["Shift", "Alt", "Up"] },
      { name: "向下复制行", keys: ["Shift", "Alt", "Down"] },
      { name: "左缩进代码", keys: ["Ctrl / Cmd", "["] },
      { name: "右缩进代码", keys: ["Ctrl / Cmd", "]"] },
      { name: "代码查询", keys: ["Ctrl / Cmd", "F"] },
      { name: "收起代码", keys: ["Ctrl / Cmd", "Shift", "["] },
      { name: "展开代码", keys: ["Ctrl / Cmd", "Shift", "]"] },
      { name: "智能提示", keys: ["Ctrl / Cmd", "Space"] },
      { name: "收起智能提示", keys: ["Escape"] },
      { name: "应用提示", keys: ["Tab / Enter"] },
    ],
  },
  {
    type: "MarkDown",
    keymap: [
      { name: "加粗", keys: ["Ctrl / Cmd", "B"] },
      { name: "倾斜", keys: ["Ctrl / Cmd", "I"] },
      { name: "中划线", keys: ["Ctrl / Cmd", "D"] },
      { name: "链接", keys: ["Ctrl / Cmd", "L"] },
      { name: "图片", keys: ["Ctrl / Cmd", "P"] },
      { name: "引用", keys: ["Ctrl / Cmd", "Shift", "Q"] },
      { name: "代码块", keys: ["Ctrl / Cmd", "J"] },
      { name: "无序列表", keys: ["Ctrl / Cmd", "U"] },
      { name: "有序列表", keys: ["Ctrl / Cmd", "O"] },
      { name: "横线", keys: ["Ctrl / Cmd", "H"] },
    ],
  },
  // {
  //   type: "其它",
  //   keymap: [],
  // },
]