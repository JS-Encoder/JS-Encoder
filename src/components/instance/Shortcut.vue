<template>
  <el-dialog @close="handleDialogState('')" :visible="visibleDialog === name" :title="shortcutsLang.title">
    <el-tabs v-model="currentTab">
      <el-tab-pane :label="shortcutsLang.common" name="common">
        <ul class="shortcut-list">
          <li v-for="(item, index) in commonList" class="flex flex-ai" :key="index">
            <div class="key" v-for="(key, i) in item" :key="i">
              <span v-if="i!==0">＋</span>
              <kbd>{{key}}</kbd>
            </div>
            <span class="dot-line flex-1"></span>
            <span class="affect">{{shortcutsLang.commonList[index]}}</span>
          </li>
        </ul>
      </el-tab-pane>
      <el-tab-pane label="Markdown" name="Markdown">
        <ul class="shortcut-list">
          <li v-for="(item, index) in markdownList" class="flex flex-ai" :key="index">
            <div class="key" v-for="(key, i) in item" :key="i">
              <span v-if="i!==0">＋</span>
              <kbd>{{key}}</kbd>
            </div>
            <span class="dot-line flex-1"></span>
            <span class="affect">{{shortcutsLang.markdownList[index]}}</span>
          </li>
        </ul>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  data() {
    return {
      name: 'shortcut',
      currentTab: 'common',
      commonList: [
        ['Tab'],
        ['Shift', 'Alt', 'F'],
        ['Ctrl / Cmd', 'Alt'],
        ['Ctrl / Cmd', 'Q'],
        ['Ctrl / Cmd', '/'],
        ['Ctrl / Cmd', 'Shift', 'D'],
        ['Ctrl / Cmd', 'D'],
        ['Shift', 'Ctrl / Cmd', 'Up'],
        ['Shift', 'Ctrl / Cmd', 'Down'],
        ['Ctrl / Cmd', '1'],
        ['Ctrl / Cmd', '2'],
        ['Ctrl / Cmd', '3'],
        ['Ctrl / Cmd', '['],
        ['Ctrl / Cmd', ']'],
        ['Ctrl / Cmd', 'F'],
        ['Ctrl / Cmd', 'Shift', 'F'],
        ['Alt', 'G'],
      ],
      markdownList: [
        ['Ctrl / Cmd', 'B'],
        ['Ctrl / Cmd', 'I'],
        ['Ctrl / Cmd', 'D'],
        ['Ctrl / Cmd', 'L'],
        ['Ctrl / Cmd', 'P'],
        ['Ctrl / Cmd', 'Shift', 'Q'],
        ['Ctrl / Cmd', 'K'],
        ['Ctrl / Cmd', 'U'],
        ['Ctrl / Cmd', 'O'],
        ['Ctrl / Cmd', 'H'],
        ['Ctrl / Cmd', 'Enter'],
      ],
    }
  },
  computed: {
    ...mapState(['visibleDialog']),
    shortcutsLang() {
      return this.$t('dialogs').shortcuts
    },
  },
  methods: {
    ...mapMutations(['handleDialogState']),
  },
}
</script>

<style lang="scss" scoped>
/* main style */
::v-deep .el-dialog {
  width: 600px !important;
  max-height: 500px;
  overflow-y: auto;
  .el-dialog__body {
    padding-top: 0 !important;
  }
}
.shortcut-list {
  li {
    margin: 5px 0;
    position: relative;
    .dot-line {
      border-top: 2px dotted;
      margin: 0 20px;
    }
    kbd {
      background-color: $thirdColor;
      font-family: Consolas;
    }
    .affect{
      color: $beforeFocus;
    }
  }
}
</style>
