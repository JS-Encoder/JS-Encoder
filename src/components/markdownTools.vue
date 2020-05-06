<template>
  <div id="markdownTools" class="flex flex-clo flex-jcc">
    <div class="menu-mg flex flex-clo flex-jcc" :class="isMDToolsOpen?'menu-mg-active':''"
      @click="isMDToolsOpen=!isMDToolsOpen">
      <i class="icon iconfont icon-tuichu"></i>
    </div>
    <div class="tools-list flex flex-sh" :class="isMDToolsOpen?'tools-list-open':''">
      <div v-for="(tool,index) in toolsList" :key="index" class="tool flex flex-jcc flex-ai flex-sh"
        @click="judgeToolsCmd(tool.name)">
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
    cm: Object
  },
  data() {
    return {
      isMDToolsOpen: false,
      toolsList: [
        {
          class: 'icon-jiacu',
          name: 'bold'
        },
        {
          class: 'icon-xieti',
          name: 'italic'
        },
        {
          class: 'icon-shanchuxian',
          name: 'delete'
        },
        {
          class: 'icon-biaoti',
          name: 'title'
        },
        {
          class: 'icon-lianjie',
          name: 'link'
        },
        {
          class: 'icon-tupian',
          name: 'picture'
        },
        {
          class: 'icon-yinyong',
          name: 'quote'
        },
        {
          class: 'icon-html',
          name: 'code'
        },
        {
          class: 'icon-wuxuliebiao',
          name: 'ul'
        },
        {
          class: 'icon-youxuliebiao',
          name: 'ol'
        },
        {
          class: 'icon-hengxian',
          name: 'line'
        }
      ]
    }
  },
  methods: {
    addTitle(level) {
      const cm = this.cm
      markdownTools.addTitle(cm, level)
    },
    judgeToolsCmd(toolName) {
      const cm = this.cm
      // 判断每个选项执行什么方法
      switch (toolName) {
        case 'bold':
          markdownTools.changeTextStyle(cm, '**')
          break
        case 'italic':
          markdownTools.changeTextStyle(cm, '*')
          break
        case 'delete':
          markdownTools.changeTextStyle(cm, '~~')
          break
        case 'code':
          markdownTools.changeTextStyle(cm, '`')
          break
        case 'link':
          markdownTools.addLink(cm)
          break
        case 'picture':
          markdownTools.addLink(cm, true)
          break
        case 'line':
          markdownTools.addLine(cm)
          break
        case 'quote':
          markdownTools.addList(cm, '> ')
          break
        case 'ul':
          markdownTools.addList(cm, '- ')
          break
        case 'ol':
          markdownTools.addOrderList(cm)
          break
        case 'title':
          return
      }
    }
  }
}
</script>
<style lang="scss" src="./componentStyle/markdownTools.scss" scoped></style>
<style lang="scss" scoped>
.dropdown-menu {
  @include setWAndH(100%, 100%);
  color: $beforeFocus;
  &:hover {
    background-color: $deepColor;
    color: $afterFocus;
  }
  i {
    outline: none;
  }
}
.el-dropdown-menu {
  background-color: $primaryHued;
  border: none;
  color: $beforeFocus;
  overflow: hidden;
  font-size: 14px;
  outline: none;
  min-width: 50px;
  & >>> .el-dropdown-menu__item {
    outline: none;
    text-align: center;
    line-height: 30px;
    @include setTransition(all, 0.3s, ease);
    &:hover {
      background-color: $deepColor;
      color: $afterFocus;
    }
  }
}
#markdownTools {
  height: 100%;
  transition: all 0.3s ease;
  cursor: pointer;
  box-sizing: border-box;
  padding: 0 5px;
  position: relative;
  .menu-mg {
    color: $beforeFocus;
    transition: all 0.3s ease;
    &:hover {
      color: $afterFocus;
    }
  }
  .menu-mg-active {
    transform: rotate(180deg);
  }
  .tools-list {
    @include setWAndH(0, 100%);
    height: 100%;
    position: absolute;
    left: 100%;
    color: $beforeFocus;
    transition: all 0.3s ease;
    overflow: hidden;
    .tool {
      @include setWAndH(40px, 100%);
      background-color: $primaryHued;
      transition: all 0.3s ease;
      box-sizing: border-box;
      border-left: 2px solid $deepColor;
      &:hover {
        background-color: $deepColor;
        color: $afterFocus;
      }
      i {
        font-size: 20px;
      }
    }
  }
  .tools-list-open {
    width: 440px;
  }
}
</style>
