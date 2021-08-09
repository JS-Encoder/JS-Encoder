<template>
  <div id="markdownTools" class="borbox">
    <div class="tools-list flex flex-sh">
      <div v-for="(tool,index) in toolsList" :key="index" class="tool borbox flex flex-jcc flex-ai flex-sh"
        @click="handleToolsCmd(tool.name)">
        <i class="icon iconfont" :class="tool.class" v-if="tool.name!=='title'"></i>
        <el-dropdown v-if="tool.name==='title'" class="dropdown-menu flex flex-ai flex-jcc" placement="top-start"
          trigger="click">
          <i class="icon iconfont" :class="tool.class" style="font-size:20px"></i>
          <el-dropdown-menu class="menu" slot="dropdown" placement="bottom">
            <el-dropdown-item v-for="index in 6" :key="index" @click.native="addTitle(index)">
              H{{index}}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import markdownTools from '@/utils/markdownTools'
export default {
  props: {
    getCodeMirror: Function,
    getIframeBody: Function,
  },
  data() {
    return {
      toolbarVisible: true,
      toolsList: [
        {
          class: 'icon-jiacu',
          name: 'bold',
        },
        {
          class: 'icon-xieti',
          name: 'italic',
        },
        {
          class: 'icon-shanchuxian',
          name: 'delete',
        },
        {
          class: 'icon-biaoti',
          name: 'title',
        },
        {
          class: 'icon-lianjie',
          name: 'link',
        },
        {
          class: 'icon-tupian',
          name: 'picture',
        },
        {
          class: 'icon-yinyong',
          name: 'quote',
        },
        {
          class: 'icon-html',
          name: 'code',
        },
        {
          class: 'icon-wuxuliebiao',
          name: 'ul',
        },
        {
          class: 'icon-youxuliebiao',
          name: 'ol',
        },
        {
          class: 'icon-hengxian',
          name: 'line',
        },
        {
          class: 'icon-pdf',
          name: 'pdf',
        },
      ],
    }
  },
  methods: {
    addTitle(level) {
      const cm = this.$props.getCodeMirror(0)
      markdownTools.handleTitle(cm, level)
    },
    handleToolsCmd(toolName) {
      const cm = this.$props.getCodeMirror(0)
      switch (toolName) {
        case 'bold':
          markdownTools.handleTextStyle(cm, '**')
          break
        case 'italic':
          markdownTools.handleTextStyle(cm, '*')
          break
        case 'delete':
          markdownTools.handleTextStyle(cm, '~~')
          break
        case 'code':
          markdownTools.handleTextStyle(cm, '`')
          break
        case 'link':
          markdownTools.handleLink(cm)
          break
        case 'picture':
          markdownTools.handleLink(cm, true)
          break
        case 'line':
          markdownTools.handleLine(cm)
          break
        case 'quote':
          markdownTools.handleUnorderedList(cm, '> ')
          break
        case 'ul':
          markdownTools.handleUnorderedList(cm, '- ')
          break
        case 'ol':
          markdownTools.handleOrderList(cm)
          break
        case 'pdf':
          const element = this.$props.getIframeBody()
          markdownTools.htmlToPDF(element)
          break
        default:
          return void 0
      }
    },
  },
}
</script>

<style lang="scss" scoped>
/deep/.el-dropdown {
  color: $beforeFocus;
  &:hover {
    background-color: $deep;
    color: $afterFocus;
  }
  i {
    outline: none;
  }
}
#markdownTools {
  width: 100%;
  height: 30px;
  cursor: pointer;
  position: relative;
  .tools-list {
    width: 100%;
    height: 100%;
    color: $beforeFocus;
    overflow: hidden;
    background-color: $secondColor;
    border-top: 1px solid $deep;
    .tool {
      width: 40px;
      height: 100%;
      border-right: 1px solid $deep;
      &:hover {
        background-color: $deep;
        color: $afterFocus;
      }
      i {
        font-size: 20px;
      }
    }
  }
}
</style>
