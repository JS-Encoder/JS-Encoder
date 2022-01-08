<template>
  <div id="editorTabBar" class="flex noselect">
    <div class="tab-list flex flex-1" ref="tabList">
      <div v-for="(item, index) in preprocessor" :key="index" class="editor-tab flex flex-jcc flex-ai"
        :class="currentTab === item ? 'active-tab' : ''" @click="handleCurrentTab(item)">
        <i class="icon iconfont" :class="iconMap[item]"></i>{{ item }}
      </div>
    </div>
    <div class="tools flex flex-sh">
      <div class="tool flex flex-ai flex-jcc" v-if="currentTab === 'Markdown'"
        @click="handleMdToolbarVisible(!mdToolbarVisible)" :class="mdToolbarVisible?'active':''">
        <i class="icon iconfont icon-gongju1"></i>
      </div>
      <div class="tool other flex flex-ai flex-jcc">
        <el-dropdown class="tools-dropdown" trigger="click">
          <i class="icon iconfont icon-menu"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(item, index) in toolsList" :key="index" 
            class="flex flex-ai" style="font-family:Consolas, Monaco" @click.native="selectTool(item)">
              <span class="flex-1">{{editorToolsLang[index]}}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import WheelDirective from '@utils/wheelDirective'
import { iconMap } from '@utils/publicData'
export default {
  data() {
    return {
      iconMap,
      toolsList: ['format']
    }
  },
  mounted() {
    new WheelDirective(this.$refs.tabList)
  },
  computed: {
    ...mapState(['preprocessor', 'currentTab', 'mdToolbarVisible']),
    editorToolsLang() {
      return this.$t('instance.editorTools')
    },
  },
  methods: {
    ...mapMutations(['handleCurrentTab', 'handleMdToolbarVisible']),
    selectTool(toolName){
      this.$emit('selectTool', toolName)
    }
  },
  components: {},
}
</script>

<style lang="scss" scoped>
@include scrollBar();
/* main style */
#editorTabBar {
  width: 100%;
  height: 30px;
  background-color: $secondColor;
  .tab-list {
    width: 100%;
    overflow-y: auto;
    overflow-y: overlay; // only fit webkit
    position: relative;
    &::-webkit-scrollbar {
      outline: none;
      height: 4px;
      background-color: transparent;
      @include setTransition(all, 0.3s, ease);
    }
    &::-webkit-scrollbar-track {
      background-color: rgba(30, 30, 30, 0);
    }
    &::-webkit-scrollbar-thumb {
      background-color: rgba(80, 80, 80, 0.3);
    }
    &::-webkit-scrollbar-thumb:hover {
      outline: none;
      background-color: rgba(80, 80, 80, 0.7);
    }
    .editor-tab {
      padding: 0 20px;
      color: $beforeFocus;
      background-color: $thirdColor;
      font-size: 14px;
      cursor: pointer;
      i {
        margin-right: 5px;
        font-size: 18px;
      }
      &:not(:first-child) {
        border-left: 1px solid $deep;
      }
      &:hover {
        color: $afterFocus;
      }
    }
    .active-tab {
      background-color: $mainColor;
      color: $afterFocus;
    }
  }
  .tools {
    font-size: 18px;
    color: $beforeFocus;
    .tool {
      width: 40px;
      cursor: pointer;
      &:hover {
        color: $afterFocus;
      }
    }
    .other {
      i {
        color: $beforeFocus;
        cursor: pointer;
        &:hover {
          color: $afterFocus;
        }
      }
    }
    .active {
      color: $primary;
    }
  }
}
/* icon style */
.icon-html {
  color: $danger;
}
.icon-markdown {
  color: $primary;
}
.icon-pug {
  color: $afterFocus;
}
.icon-style {
  color: lightblue;
}
.icon-less {
  color: $afterFocus;
}
.icon-Sass {
  color: $pink;
}
.icon-stylus {
  color: orangered;
}
.icon-javascript {
  color: $gold;
}
.icon-typescript {
  color: $primary;
}
.icon-coffeescript {
  color: lightcoral;
}
</style>
