<template>
  <div class="markdown-tools flex flex-wrap bg-main2">
    <div
      class="markdown-tool flex-sh text-hover-active bg-main1 cursor-pointer"
      v-for="tool in toolInfoMap"
      :key="tool.type"
      :title="tool.title"
      @click="handleClickTool(tool)">
      <dropdown v-if="tool.dropdown" v-model="tool.showDropdown" :align="Align.MIDDLE">
        <template #default>
          <div class="markdown-tool fade-ease fill flex-center">
            <i class="icon iconfont" :class="tool.icon"></i>
          </div>
        </template>
        <template #options>
          <dropdown-item
            v-for="(item, index) in tool.dropdown"
            :key="index"
            @click="handleClickDropdownItem(tool, index)">
            <div :title="item.title">
              <i v-if="item.icon" class="icon icon" :class="item.icon"></i>
              <span>{{ item.title }}</span>
            </div>
          </dropdown-item>
        </template>
      </dropdown>
      <div v-else class="fade-ease fill flex-center">
        <i class="icon iconfont" :class="tool.icon"></i>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * desc: 使用markdown的时候作为快捷工具栏出现在编辑区域上方
 */
import { IProps, ITitleInfo, IToolInfo, ToolType, toolInfoMap } from "./markdown-tools"
import Dropdown from "@components/dropdown/dropdown.vue"
import DropdownItem from "@components/dropdown/dropdown-item.vue"
import { Align } from "@type/interface"
import { MarkdownTools } from "@utils/editor/utils/markdown-tools"
import PreviewService from "@utils/services/preview-service"

const props = defineProps<IProps>()

const markdownTools = new MarkdownTools(props.view)
const previewService = new PreviewService()

const toolType2FuncMap = {
  [ToolType.BOLD]: () => markdownTools.changeTextStyle("**"),
  [ToolType.ITALIC]: () => markdownTools.changeTextStyle("*"),
  [ToolType.DELETE]: () => markdownTools.changeTextStyle("~~"),
  [ToolType.TITLE]: () => {},
  [ToolType.LINK]: () => markdownTools.insertLink(),
  [ToolType.IMAGE]: () => markdownTools.insertLink(true),
  [ToolType.QUOTE]: () => markdownTools.insertUnorderedList(">"),
  [ToolType.CODE]: () => markdownTools.changeTextStyle("`"),
  [ToolType.UL]: () => markdownTools.insertUnorderedList("-"),
  [ToolType.OL]: () => markdownTools.insertOrderList(),
  [ToolType.LINE]: () => markdownTools.insertLine(),
  [ToolType.PDF]: () => processHTML2Pdf(),
}

const processChooseTitle = (titleInfo: ITitleInfo) => {
  const { level } = titleInfo
  markdownTools.insertTitle(level)
}

const processHTML2Pdf = () => {
  const iframeWindow = previewService.getWindow()!
  iframeWindow.focus()
  iframeWindow.print()
}

const handleClickTool = (tool: IToolInfo) => {
  const { type } = tool
  toolType2FuncMap[type]?.()
  props.view.focus()
}

/** 点击下拉菜单项 */
const handleClickDropdownItem = (tool: IToolInfo, index: number) => {
  const { type, dropdown = [] } = tool
  if (type === ToolType.TITLE) {
    processChooseTitle(dropdown[index] as ITitleInfo)
    props.view.focus()
  } else { }
}
</script>

<style lang="scss" scoped>
.markdown-tools {
  border-top: 1px solid var(--color-main-bg-3);
  .markdown-tool {
    width: 34px;
    height: 34px;
    border-right: 1px solid var(--color-main-bg-3);
    border-bottom: 1px solid var(--color-main-bg-3);
  }
}
</style>